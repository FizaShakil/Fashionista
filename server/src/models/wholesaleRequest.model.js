import mongoose, { Schema } from 'mongoose'

// --- Phase 2: WholesaleRequest collection ---
// Stores onboarding application data. Separated from the User model so
// multiple requests per user are possible (history) without bloating User.
//
// User retains only account state: customerType, wholesaleStatus, companyDetails
// This collection retains: application info, status, review history
//
// IMPORTANT — Phase 3 rule:
// WholesaleRequest.status === 'approved' does NOT trigger wholesale pricing.
// Phase 3 pricingEngine evaluates:
//   User.wholesaleStatus + order qualification + product.wholesaleRegularPrice

const wholesaleRequestSchema = new Schema({

    // ── Relationship ──────────────────────────────────────────────────────────
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // ── Application fields (no otherInfo per spec) ────────────────────────────
    businessType: {
        type: String,
        required: [true, 'Business type is required']
    },
    expectedQuantity: {
        type: String,
        required: [true, 'Expected quantity is required']
    },
    expectedFrequency: {
        type: String,
        required: [true, 'Expected order frequency is required']
    },
    city: {
        type: String,
        required: [true, 'City/location is required'],
        trim: true
    },
    storeName: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    instagramProfile: {
        type: String,
        default: null
    },

    // ── Status & review metadata ──────────────────────────────────────────────
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }

}, { timestamps: true })

export const WholesaleRequest = mongoose.model('WholesaleRequest', wholesaleRequestSchema)
