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
        categoryId   // optional single category ID from admin form
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
        categories
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
        categoryId   // optional — pass null to clear, pass ID to set
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
// PUBLIC: Get product listing
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
    updateProductImage,
    getSingleProductDetails
}
