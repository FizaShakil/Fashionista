import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Create category
// POST /api/v1/categories
// ─────────────────────────────────────────────────────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, image, parentCategory } = req.body

    if (!name?.trim()) throw new ApiError(400, 'Category name is required')
    if (!slug?.trim()) throw new ApiError(400, 'Category slug is required')

    const existing = await Category.findOne({
        $or: [
            { name: name.trim() },
            { slug: slug.trim().toLowerCase() }
        ]
    })
    if (existing) {
        throw new ApiError(409, existing.slug === slug.trim().toLowerCase()
            ? 'A category with this slug already exists'
            : 'A category with this name already exists'
        )
    }

    // Validate parent if provided
    if (parentCategory) {
        const parent = await Category.findById(parentCategory)
        if (!parent) throw new ApiError(404, 'Parent category not found')
    }

    const category = await Category.create({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentCategory: parentCategory || null
    })

    return res.status(201).json(
        new ApiResponse(201, category, 'Category created successfully')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Update category
// PATCH /api/v1/categories/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, slug, description, image, isActive, parentCategory } = req.body

    const category = await Category.findById(id)
    if (!category) throw new ApiError(404, 'Category not found')

    // Check uniqueness only if changing the value
    if (name && name.trim() !== category.name) {
        const dup = await Category.findOne({ name: name.trim(), _id: { $ne: id } })
        if (dup) throw new ApiError(409, 'A category with this name already exists')
        category.name = name.trim()
    }
    if (slug && slug.trim().toLowerCase() !== category.slug) {
        const dup = await Category.findOne({ slug: slug.trim().toLowerCase(), _id: { $ne: id } })
        if (dup) throw new ApiError(409, 'A category with this slug already exists')
        category.slug = slug.trim().toLowerCase()
    }
    if (description !== undefined) category.description = description?.trim() || null
    if (image !== undefined)       category.image       = image?.trim()       || null
    if (isActive !== undefined)    category.isActive    = Boolean(isActive)
    if (parentCategory !== undefined) {
        if (parentCategory === null) {
            category.parentCategory = null
        } else {
            const parent = await Category.findById(parentCategory)
            if (!parent) throw new ApiError(404, 'Parent category not found')
            if (parent._id.toString() === id) throw new ApiError(400, 'Category cannot be its own parent')
            category.parentCategory = parentCategory
        }
    }

    await category.save()

    return res.status(200).json(
        new ApiResponse(200, category, 'Category updated successfully')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Deactivate category (soft delete)
// DELETE /api/v1/categories/:id
// Products are NOT deleted — they retain the reference. Deactivated categories
// are simply excluded from public listings. Products without active categories
// remain accessible; the category reference becomes stale but does not break them.
// ─────────────────────────────────────────────────────────────────────────────
const deactivateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) throw new ApiError(404, 'Category not found')

    category.isActive = false
    await category.save()

    const affectedCount = await Product.countDocuments({ categories: id })

    return res.status(200).json(
        new ApiResponse(200, {
            category,
            affectedProducts: affectedCount
        }, `Category deactivated. ${affectedCount} product(s) retain the reference but the category is no longer publicly listed.`)
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Get all active categories
// GET /api/v1/categories
// ─────────────────────────────────────────────────────────────────────────────
const getActiveCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .sort({ name: 1 })
        .lean()

    return res.status(200).json(
        new ApiResponse(200, categories, 'Categories fetched successfully')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Get all categories (including inactive)
// GET /api/v1/categories/all
// ─────────────────────────────────────────────────────────────────────────────
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({})
        .sort({ name: 1 })
        .lean()

    return res.status(200).json(
        new ApiResponse(200, categories, 'All categories fetched')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Get category by slug
// GET /api/v1/categories/:slug
// ─────────────────────────────────────────────────────────────────────────────
const getCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params

    const category = await Category.findOne({ slug: slug.toLowerCase(), isActive: true })
    if (!category) throw new ApiError(404, 'Category not found')

    return res.status(200).json(
        new ApiResponse(200, category, 'Category fetched successfully')
    )
})

export {
    createCategory,
    updateCategory,
    deactivateCategory,
    getActiveCategories,
    getAllCategories,
    getCategoryBySlug
}
