import { Cart } from '../models/cart.model.js'
import { Order } from '../models/order.model.js'
import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { buildCustomerContext, getEffectivePrice } from '../services/pricing.service.js'

// ─────────────────────────────────────────────────────────────────────────────
// Place order
// POST /api/v1/orders/place-order
//
// Backend re-calculates all prices using the pricing service.
// Frontend subtotals and prices are completely ignored.
// unitPricePaid is snapshotted at checkout to protect historical pricing.
// ─────────────────────────────────────────────────────────────────────────────
const placeUserOrder = asyncHandler(async (req, res) => {
    const userID = req.user?._id
    if (!userID) throw new ApiError(401, "Login required to place an order")

    const { name, address, phone, email, paymentMethod } = req.body
    if (!name || !email || !address || !phone) {
        throw new ApiError(400, "name, email, address and phone are required")
    }

    // Load cart — only productID + quantity stored in DB
    const cart = await Cart.findOne({ userID }).lean()
    if (!cart || cart.products.length === 0) throw new ApiError(400, "Cart is empty")

    const customerCtx = buildCustomerContext(req.user)

    // Resolve pricing server-side for every cart item
    let totalAmount = 0
    const orderProducts = []

    for (const item of cart.products) {
        const product = await Product.findById(item.productID).lean()
        if (!product) throw new ApiError(400, `Product ${item.productID} no longer exists`)

        const pricing = getEffectivePrice(product, customerCtx, item.quantity)

        // For wholesale customers: enforce MOQ at checkout
        if (pricing.pricingType === 'wholesale' && !pricing.meetsMOQ) {
            throw new ApiError(400,
                `Minimum order quantity for "${product.name}" is ${pricing.wholesaleMOQ} units (you have ${item.quantity})`
            )
        }

        // Snapshot the effective price at checkout — this never changes post-order
        const unitPricePaid = pricing.effectivePrice
        const lineTotal     = unitPricePaid * item.quantity
        totalAmount        += lineTotal

        orderProducts.push({
            productID:    item.productID,
            quantity:     item.quantity,
            unitPricePaid,
            productName:  product.name   // snapshot in case product is later deleted
        })
    }

    // Determine order type from customer context
    const orderType = customerCtx.wholesaleStatus === 'approved' &&
                      customerCtx.customerType === 'wholesale'
        ? 'wholesale'
        : 'retail'

    const newOrder = await Order.create({
        userID,
        name,
        address,
        phone,
        email,
        products:      orderProducts,
        amount:        totalAmount,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        orderType
    })

    if (!newOrder) throw new ApiError(500, "Failed to place order")

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ userID }, { $set: { products: [] } })

    return res.status(200).json(
        new ApiResponse(200, newOrder, "Order placed successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Get user's own orders
// GET /api/v1/orders/get-user-orders
//
// Displays unitPricePaid from the order snapshot, not the live product price.
// Falls back gracefully for legacy orders where unitPricePaid is null.
// ─────────────────────────────────────────────────────────────────────────────
const getUserOrders = asyncHandler(async (req, res) => {
    const userID = req.user._id

    const orders = await Order.find({ userID })
        .populate({
            path:   'products.productID',
            select: 'name price gender productImage retailRegularPrice'
        })
        .sort({ createdAt: -1 })

    if (!orders || orders.length === 0) throw new ApiError(404, "No orders found")

    // Enrich order items: use unitPricePaid if available, fall back to live price
    // for legacy orders only (pre-Phase 3)
    const enrichedOrders = orders.map(order => {
        const orderObj = order.toObject()
        orderObj.products = orderObj.products.map(item => ({
            ...item,
            displayPrice: item.unitPricePaid !== null
                ? item.unitPricePaid
                : (item.productID?.retailRegularPrice ?? item.productID?.price ?? null)
        }))
        return orderObj
    })

    return res.status(200).json(
        new ApiResponse(200, enrichedOrders, "Orders fetched successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Get single order (admin)
// GET /api/v1/orders/get-single-order/:id
// ─────────────────────────────────────────────────────────────────────────────
const getSingleOrder = asyncHandler(async (req, res) => {
    const { id } = req.params

    const order = await Order.findById(id)
        .populate({
            path:   'products.productID',
            select: 'name price gender productImage retailRegularPrice'
        })

    if (!order) throw new ApiError(404, "Order not found")

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Update order status (admin)
// PATCH /api/v1/orders/update-order-status/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) throw new ApiError(404, "Order not found")

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Get all orders (admin)
// GET /api/v1/orders/admin/get-all-orders
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('userID', 'username email customerType wholesaleStatus')
        .populate({
            path:   'products.productID',
            select: 'name price gender productImage retailRegularPrice'
        })
        .sort({ createdAt: -1 })

    if (!orders || orders.length === 0) throw new ApiError(404, "No orders found")

    return res.status(200).json(
        new ApiResponse(200, orders, "All orders fetched successfully")
    )
})

export { placeUserOrder, getSingleOrder, getUserOrders, updateOrderStatus, getAllOrders }
