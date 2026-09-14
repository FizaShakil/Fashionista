import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from '../utils/asyncHandler.js'
import { buildCustomerContext, getEffectivePrice } from '../services/pricing.service.js'

// ─────────────────────────────────────────────────────────────────────────────
// Add product to cart
// POST /api/v1/cart/add-to-cart
// ─────────────────────────────────────────────────────────────────────────────
const addToCart = asyncHandler(async (req, res) => {
    const userID = req.user._id
    const { productID } = req.body

    // Verify the product exists before adding
    const product = await Product.findById(productID).lean()
    if (!product) throw new ApiError(404, "Product not found")

    let cart = await Cart.findOne({ userID })
    if (!cart) {
        cart = new Cart({ userID, products: [{ productID, quantity: 1 }] })
    } else {
        const existing = cart.products.find(p => p.productID.toString() === productID)
        if (existing) {
            existing.quantity += 1
        } else {
            cart.products.push({ productID, quantity: 1 })
        }
    }

    await cart.save()

    return res.status(200).json(
        new ApiResponse(200, cart, "Product added to cart successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Update quantity in cart
// PATCH /api/v1/cart/update-quantity
// ─────────────────────────────────────────────────────────────────────────────
const updateQuantity = asyncHandler(async (req, res) => {
    const userID = req.user._id
    const { productID, action } = req.body

    const cart = await Cart.findOne({ userID })
    if (!cart) throw new ApiError(404, "Cart not found")

    const item = cart.products.find(p => p.productID.toString() === productID)
    if (!item) throw new ApiError(404, "Item not found in cart")

    if (action === 'increment') item.quantity += 1
    if (action === 'decrement' && item.quantity > 1) item.quantity -= 1

    await cart.save()

    return res.status(200).json(
        new ApiResponse(200, cart, "Quantity updated successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Remove product from cart
// POST /api/v1/cart/remove-from-cart
// ─────────────────────────────────────────────────────────────────────────────
const removeFromCart = asyncHandler(async (req, res) => {
    const userID = req.user._id
    const { productID } = req.body

    const cart = await Cart.findOne({ userID })
    if (!cart) throw new ApiError(404, "Cart not found")

    cart.products = cart.products.filter(p => p.productID.toString() !== productID)

    await cart.save()

    return res.status(200).json(
        new ApiResponse(200, cart, "Product removed successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Get cart with backend-resolved pricing
// GET /api/v1/cart/get-cart
//
// Backend resolves effectivePrice for each item using the pricing service.
// The frontend must NOT trust any price it sent — the backend is authoritative.
// ─────────────────────────────────────────────────────────────────────────────
const getCart = asyncHandler(async (req, res) => {
    const userID = req.user._id

    const cart = await Cart.findOne({ userID }).lean()

    if (!cart || cart.products.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, { products: [], subtotal: 0 }, "Cart is empty")
        )
    }

    const customerCtx = buildCustomerContext(req.user)

    // Resolve pricing for each cart item from DB — client price is never trusted
    const enrichedProducts = await Promise.all(
        cart.products.map(async (item) => {
            const product = await Product.findById(item.productID).lean()
            if (!product) {
                // Product was deleted — mark it as unavailable
                return {
                    productID:    item.productID,
                    quantity:     item.quantity,
                    _unavailable: true
                }
            }

            const pricing = getEffectivePrice(product, customerCtx, item.quantity)

            return {
                productID: {
                    _id:          product._id,
                    name:         product.name,
                    productImage: product.productImage,
                    gender:       product.gender,
                    // Keep legacy price for backward compat with existing frontend display
                    price:        pricing.effectivePrice
                },
                quantity:  item.quantity,
                pricing,
                lineTotal: pricing.effectivePrice * item.quantity
            }
        })
    )

    const subtotal = enrichedProducts.reduce((sum, item) => sum + (item.lineTotal || 0), 0)

    return res.status(200).json(
        new ApiResponse(200, {
            _id:      cart._id,
            userID:   cart.userID,
            products: enrichedProducts,
            subtotal
        }, "Cart fetched successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// Sync cart (on login — merge guest localStorage cart into DB)
// POST /api/v1/cart/sync
// ─────────────────────────────────────────────────────────────────────────────
const syncCartController = asyncHandler(async (req, res) => {
    const userID = req.user._id
    const cartFromFrontend = req.body.cartItems

    if (!Array.isArray(cartFromFrontend) || cartFromFrontend.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, { message: "No items to sync" }, "Cart sync completed")
        )
    }

    const refinedProducts = cartFromFrontend.map((item) => ({
        productID: item._id || item.productID,
        quantity:  item.quantity || 1
    }))

    const existingCart = await Cart.findOne({ userID })

    if (existingCart) {
        existingCart.products = refinedProducts
        await existingCart.save()
    } else {
        await Cart.create({ userID, products: refinedProducts })
    }

    return res.status(200).json(
        new ApiResponse(200, { message: "Cart synced successfully" }, "Cart synced successfully")
    )
})

export { addToCart, updateQuantity, removeFromCart, getCart, syncCartController }
