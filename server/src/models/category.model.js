import mongoose, { Schema } from 'mongoose'

// --- Phase 1: Category Model ---
// Supports flat and one-level-deep hierarchical categories.
// Products reference categories via an ObjectId array.
// Categories are slug-driven for clean URL routing in later phases.

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export const Category = mongoose.model('Category', categorySchema)
