import { Product } from "../models/product.model.js"
import { Category } from "../models/category.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { buildCustomerContext, attachPricing } from '../services/pricing.service.js'
import path from "path"

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Upload / create product
// POST /api/v1/products/upload-product-details  (also: /add-product-details)
// ─────────────────────────────────────────────────────────────────────────────
const uploadProductDetails = asyncHandler(async (req, res) => {
    const {
        name, productUniqueID, description, price, gender, newArrival,
        retailRegularPrice, retailSalePrice,
        wholesaleRegularPrice, wholesaleSalePrice, wholesaleMOQ,
        categoryId,  // optional single category ID from admin form
        colors       // optional JSON string array e.g. '["Red","Blue"]'
    } = req.body

    if ([name, productUniqueID, description, gender].some(f => !f?.toString().trim())) {
        throw new ApiError(400, "name, productUniqueID, description and gender are required")
    }
    if (!price && !retailRegularPrice) {
        throw new ApiError(400, "A retail price is required")
    }

    const productImageLocalPath = path.join(process.cwd(), req.file?.path).replace(/\\/g, "/")
    if (!productImageLocalPath) throw new ApiError(400, "Product image required")

    const productImage = await uploadOnCloudinary(productImageLocalPath)
    if (!productImage) throw new ApiError(400, "Failed to upload product image to Cloudinary")

    const numericRetailRegular = Number(retailRegularPrice || price)
    const numericPrice         = Number(price || retailRegularPrice)
    const numericRetailSale    = retailSalePrice        ? Number(retailSalePrice)        : null
    const numericWsRegular     = wholesaleRegularPrice  ? Number(wholesaleRegularPrice)  : null
    const numericWsSale        = wholesaleSalePrice     ? Number(wholesaleSalePrice)     : null
    const numericMOQ           = wholesaleMOQ           ? Number(wholesaleMOQ)           : 1

    if (numericRetailSale !== null && numericRetailSale >= numericRetailRegular)
        throw new ApiError(400, "retailSalePrice must be less than retailRegularPrice")
    if (numericWsRegular !== null && numericWsSale !== null && numericWsSale >= numericWsRegular)
        throw new ApiError(400, "wholesaleSalePrice must be less than wholesaleRegularPrice")
    if (numericMOQ <= 0 || !Number.isInteger(numericMOQ))
        throw new ApiError(400, "wholesaleMOQ must be a positive integer")

    // Validate and resolve category
    const categories = []
    if (categoryId) {
        const cat = await Category.findById(categoryId)
        if (!cat) throw new ApiError(400, "Invalid category ID")
        if (!cat.isActive) throw new ApiError(400, "Cannot assign a deactivated category")
        categories.push(cat._id)
    }

    // Parse colors — sent as JSON string from FormData
    let parsedColors = []
    if (colors) {
        try {
            parsedColors = JSON.parse(colors)
            if (!Array.isArray(parsedColors)) parsedColors = []
            parsedColors = parsedColors.map(c => c.trim()).filter(Boolean)
        } catch {
            parsedColors = []
        }
    }

    const product = await Product.create({
        name, productUniqueID, description,
        price:                numericPrice,
        retailRegularPrice:   numericRetailRegular,
        retailSalePrice:      numericRetailSale,
        wholesaleRegularPrice: numericWsRegular,
        wholesaleSalePrice:   numericWsSale,
        wholesaleMOQ:         numericMOQ,
        gender,
        productImage:         productImage.url,
        newArrival:           newArrival === 'true' || newArrival === true,
        categories,
        colors:               parsedColors
    })

    const uploadedProduct = await Product.findById(product._id).populate('categories', 'name slug')
    if (!uploadedProduct) throw new ApiError(500, "Something went wrong while saving product")

    return res.status(201).json(
        new ApiResponse(200, uploadedProduct, "Product uploaded successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Update product details
// PATCH /api/v1/products/update-product-details
// ─────────────────────────────────────────────────────────────────────────────
const updateProductDetails = asyncHandler(async (req, res) => {
    const {
        productUniqueID, name, description, price, gender, newArrival,
        retailRegularPrice, retailSalePrice,
        wholesaleRegularPrice, wholesaleSalePrice, wholesaleMOQ,
        categoryId,  // optional — pass null to clear, pass ID to set
        colors       // optional — JSON string array, pass [] to clear
    } = req.body

    if (!productUniqueID) throw new ApiError(400, "productUniqueID is required")

    const product = await Product.findOne({ productUniqueID })
    if (!product) throw new ApiError(404, "Product not found")

    if (name)        product.name        = name
    if (description) product.description = description
    if (gender)      product.gender      = gender
    if (newArrival !== undefined) product.newArrival = newArrival

    if (price || retailRegularPrice) {
        const newRetailRegular = Number(retailRegularPrice || price)
        product.price              = Number(price || retailRegularPrice)
        product.retailRegularPrice = newRetailRegular
    }
    if (retailSalePrice !== undefined) {
        const numSale = retailSalePrice === null || retailSalePrice === '' ? null : Number(retailSalePrice)
        if (numSale !== null && numSale >= product.retailRegularPrice)
            throw new ApiError(400, "retailSalePrice must be less than retailRegularPrice")
        product.retailSalePrice = numSale
    }
    if (wholesaleRegularPrice !== undefined) {
        product.wholesaleRegularPrice = wholesaleRegularPrice === null || wholesaleRegularPrice === ''
            ? null : Number(wholesaleRegularPrice)
    }
    if (wholesaleSalePrice !== undefined) {
        const numWsSale = wholesaleSalePrice === null || wholesaleSalePrice === '' ? null : Number(wholesaleSalePrice)
        if (numWsSale !== null && product.wholesaleRegularPrice !== null && numWsSale >= product.wholesaleRegularPrice)
            throw new ApiError(400, "wholesaleSalePrice must be less than wholesaleRegularPrice")
        product.wholesaleSalePrice = numWsSale
    }
    if (wholesaleMOQ !== undefined && wholesaleMOQ !== '') {
        const numMOQ = Number(wholesaleMOQ)
        if (numMOQ <= 0 || !Number.isInteger(numMOQ))
            throw new ApiError(400, "wholesaleMOQ must be a positive integer")
        product.wholesaleMOQ = numMOQ
    }

    // Category update
    if (categoryId !== undefined) {
        if (categoryId === null || categoryId === '') {
            product.categories = []
        } else {
            const cat = await Category.findById(categoryId)
            if (!cat) throw new ApiError(400, "Invalid category ID")
            if (!cat.isActive) throw new ApiError(400, "Cannot assign a deactivated category")
            product.categories = [cat._id]
        }
    }

    // Colors update — sent as JSON string array
    if (colors !== undefined) {
        try {
            const parsed = JSON.parse(colors)
            product.colors = Array.isArray(parsed)
                ? parsed.map(c => c.trim()).filter(Boolean)
                : []
        } catch {
            product.colors = []
        }
    }

    await product.save()

    const updated = await Product.findById(product._id).populate('categories', 'name slug')
    return res.status(200).json(
        new ApiResponse(200, updated, "Product updated successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Delete product
// DELETE /api/v1/products/delete-product-details
// ─────────────────────────────────────────────────────────────────────────────
const deleteProductDetails = asyncHandler(async (req, res) => {
    const { productUniqueID } = req.body
    if (!productUniqueID) throw new ApiError(400, "productUniqueID is required")

    const product = await Product.findOneAndDelete({ productUniqueID })
    if (!product) throw new ApiError(404, "Product not found")

    return res.status(200).json(
        new ApiResponse(200, product, "Product deleted successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Get product listing (legacy — basic filters)
// GET /api/v1/products/get-product-details
// Uses verifyJWTOptional — req.user may be undefined (guest)
// ─────────────────────────────────────────────────────────────────────────────
const getProductDetails = asyncHandler(async (req, res) => {
    const { gender, newArrival, search, price, category } = req.query

    const filter = {}
    if (gender)     filter.gender     = gender
    if (price)      filter.price      = Number(price)
    if (newArrival) filter.newArrival = newArrival === "true"
    if (search)     filter.name       = { $regex: search, $options: "i" }

    // Filter by category slug
    if (category) {
        const cat = await Category.findOne({ slug: category.toLowerCase(), isActive: true })
        if (!cat) {
            // Unknown slug — return empty rather than crash
            return res.status(200).json(new ApiResponse(200, [], "No products found for this category"))
        }
        filter.categories = cat._id
    }

    const products = await Product.find(filter)
        .populate('categories', 'name slug')
        .lean()

    const customerCtx = buildCustomerContext(req.user || null)
    const pricedProducts = products.map(p => attachPricing(p, customerCtx))

    return res.status(200).json(
        new ApiResponse(200, pricedProducts, "Products fetched successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Advanced product query with filters, sorting, and pagination
// GET /api/v1/products/search
// Query params:
//   - search: search term (searches name, description, productUniqueID)
//   - category: category slug
//   - gender: product gender (Male/Female)
//   - color: color value (single value, not array)
//   - minPrice: minimum price (effective price after sale)
//   - maxPrice: maximum price (effective price after sale)
//   - sale: "true" to show only sale items
//   - sort: newest | price_asc | price_desc | name_asc | name_desc (default: newest)
//   - page: page number (default: 1)
//   - limit: items per page (default: 12, max: 100)
// Uses verifyJWTOptional — req.user may be undefined (guest)
// ─────────────────────────────────────────────────────────────────────────────
const searchProducts = asyncHandler(async (req, res) => {
    const {
        search, category, gender, color, minPrice, maxPrice, sale,
        sort = 'newest', page = 1, limit = 12
    } = req.query

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12))
    const skip = (pageNum - 1) * limitNum

    // Build MongoDB filter
    const filter = {}

    // Search filter: case-insensitive across multiple fields
    if (search && search.trim()) {
        const searchRegex = { $regex: search.trim(), $options: 'i' }
        filter.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { productUniqueID: searchRegex }
        ]
    }

    // Gender filter
    if (gender) {
        filter.gender = gender
    }

    // Category filter by slug
    if (category) {
        const cat = await Category.findOne({ slug: category.toLowerCase(), isActive: true })
        if (!cat) {
            // Unknown slug — return empty
            return res.status(200).json(
                new ApiResponse(200, {
                    products: [],
                    pagination: {
                        total: 0,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPreviousPage: false
                    }
                }, "No products found")
            )
        }
        filter.categories = cat._id
    }

    // Color filter
    if (color) {
        filter.colors = color
    }

    // newArrival filter
    if (req.query.newArrival === 'true') {
        filter.newArrival = true
    }

    // Get total count before pagination (after filters except price/sale)
    let matchedProducts = await Product.find(filter)
        .populate('categories', 'name slug')
        .lean()

    // Build customer context for pricing
    const customerCtx = buildCustomerContext(req.user || null)

    // Attach pricing to all matched products
    const pricedProducts = matchedProducts.map(p => attachPricing(p, customerCtx))

    // Apply price range filter on effective prices
    let filteredByPrice = pricedProducts
    if (minPrice || maxPrice) {
        const min = minPrice ? Number(minPrice) : 0
        const max = maxPrice ? Number(maxPrice) : Infinity
        filteredByPrice = pricedProducts.filter(p => {
            const effectivePrice = p.pricing.effectivePrice
            return effectivePrice >= min && effectivePrice <= max
        })
    }

    // Apply sale filter
    let filteredBySale = filteredByPrice
    if (sale === 'true') {
        filteredBySale = filteredByPrice.filter(p => p.pricing.salePrice !== null)
    }

    const total = filteredBySale.length

    // Apply sorting
    let sorted = [...filteredBySale]
    switch (sort) {
        case 'price_asc':
            sorted.sort((a, b) => a.pricing.effectivePrice - b.pricing.effectivePrice)
            break
        case 'price_desc':
            sorted.sort((a, b) => b.pricing.effectivePrice - a.pricing.effectivePrice)
            break
        case 'name_asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name))
            break
        case 'name_desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name))
            break
        case 'newest':
        default:
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            break
    }

    // Apply pagination
    const paginatedProducts = sorted.slice(skip, skip + limitNum)

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json(
        new ApiResponse(200, {
            products: paginatedProducts,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1
            }
        }, "Products fetched successfully")
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Distinct colors for navigation facets
// GET /api/v1/products/colors
// Lightweight — a single Product.distinct() call over the existing colors field.
// No pricing, no auth, no wholesale data. Feeds the Phase 8 mega menu
// "Shop by Color" section so navigation stays data-driven from real catalog data.
// ─────────────────────────────────────────────────────────────────────────────
const getDistinctColors = asyncHandler(async (req, res) => {
    const colors = await Product.distinct('colors', {
        colors: { $exists: true, $ne: [] }
    })

    const cleaned = (Array.isArray(colors) ? colors : [])
        .filter(c => typeof c === 'string' && c.trim())
        .map(c => c.trim())
        .filter(Boolean)

    return res.status(200).json(
        new ApiResponse(200, cleaned, 'Colors fetched successfully')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Get single product detail
// GET /api/v1/products/get-single-product-details/:id
// Uses verifyJWTOptional — req.user may be undefined (guest)
// ─────────────────────────────────────────────────────────────────────────────
const getSingleProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params

    const product = await Product.findById(id)
        .populate('categories', 'name slug')
        .lean()
    if (!product) throw new ApiError(404, "Product not found")

    const customerCtx = buildCustomerContext(req.user || null)
    const pricedProduct = attachPricing(product, customerCtx)

    return res.status(200).json(
        new ApiResponse(200, pricedProduct, "Product fetched successfully")
    )
})

const updateProductImage = asyncHandler(async (req, res) => {
    const productImagePath = req.files?.path
    if (!productImagePath) throw new ApiError(400, "Path required")

    const productImage = await uploadOnCloudinary(productImagePath)
    if (!productImage) throw new ApiError(400, "Failed to upload image")

    const product = await Product.findByIdAndUpdate(
        req.product?._id,
        { $set: { productImage: productImage.url } },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, product, "Product image updated"))
})

export {
    uploadProductDetails,
    updateProductDetails,
    deleteProductDetails,
    getProductDetails,
    searchProducts,
    updateProductImage,
    getDistinctColors,
    getSingleProductDetails
}
