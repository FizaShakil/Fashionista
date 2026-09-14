import mongoose, { Schema } from 'mongoose'

// Phase 5: Category collection
// Products reference categories via ObjectId array (Product.categories[]).
// Slug-driven for clean URL routing (/category/:slug).

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
        trim: true,  
        index: true
    },
    description: {
        type: String,
        default: null
    },
    image: {
        type: String,   // Cloudinary URL, optional
        default: null
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true })

export const Category = mongoose.model('Category', categorySchema)
