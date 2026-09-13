import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { WholesaleRequest } from '../models/wholesaleRequest.model.js'

// Valid values — kept as constants so the form and backend stay in sync.
// Do NOT treat these as a pricing threshold or auto-approval trigger.
const VALID_BUSINESS_TYPES = [
    'Retail shop',
    'Online store',
    'Instagram/Facebook business',
    'Home-based business',
    'Reseller',
    'Boutique',
    'Other'
]

const VALID_QUANTITIES = [
    '5–9 pieces',
    '10–24 pieces',
    '25–49 pieces',
    '50–99 pieces',
    '100+ pieces'
]

const VALID_FREQUENCIES = [
    'One-time',
    'Monthly',
    '2–3 times per month',
    'Regularly'
]

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT: Submit wholesale onboarding request
// POST /api/v1/users/wholesale/request
// Auth: verifyJWT
// Mounted at: app.use('/api/v1/users/wholesale', wholesaleRouter)
//             → wholesaleRouter.route('/request')
// ─────────────────────────────────────────────────────────────────────────────
const submitWholesaleRequest = asyncHandler(async (req, res) => {
    const userID = req.user._id

    // Always read fresh from DB — JWT payload is not trusted for status
    const user = await User.findById(userID)
    if (!user) throw new ApiError(404, 'User not found')

    // Block re-submission when already pending or approved.
    // Rejected / none users can submit a fresh request (history is preserved).
    if (user.wholesaleStatus === 'pending') {
        throw new ApiError(409, 'Your wholesale request is already under review')
    }
    if (user.wholesaleStatus === 'approved') {
        throw new ApiError(409, 'Your account already has wholesale access')
    }

    const { businessType, expectedQuantity, expectedFrequency, city, storeName, website, instagramProfile } = req.body

    // Required field validation
    if (!businessType?.trim())      throw new ApiError(400, 'Business type is required')
    if (!expectedQuantity?.trim())  throw new ApiError(400, 'Expected quantity is required')
    if (!expectedFrequency?.trim()) throw new ApiError(400, 'Expected order frequency is required')
    if (!city?.trim())              throw new ApiError(400, 'City/location is required')
    if (!storeName?.trim())         throw new ApiError(400, 'Business/store name is required')

    if (!VALID_BUSINESS_TYPES.includes(businessType)) {
        throw new ApiError(400, 'Invalid business type selected')
    }
    if (!VALID_QUANTITIES.includes(expectedQuantity)) {
        throw new ApiError(400, 'Invalid expected quantity selected')
    }
    if (!VALID_FREQUENCIES.includes(expectedFrequency)) {
        throw new ApiError(400, 'Invalid expected frequency selected')
    }

    // Create WholesaleRequest document — data no longer embedded in User
    const wholesaleRequest = await WholesaleRequest.create({
        userId:            userID,
        businessType,
        expectedQuantity,
        expectedFrequency,
        city:              city.trim(),
        storeName:         storeName.trim(),
        website:           website?.trim()          || null,
        instagramProfile:  instagramProfile?.trim() || null,
        status:            'pending',
        submittedAt:       new Date()
    })

    // Update User account state only — no request data written into User
    // NOTE: wholesaleStatus = 'pending' does NOT grant wholesale pricing.
    // Phase 3 pricingEngine evaluates: eligibility + order qualification + product availability.
    user.wholesaleStatus = 'pending'
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {
            wholesaleStatus:  user.wholesaleStatus,
            wholesaleRequest: wholesaleRequest
        }, 'Wholesale request submitted successfully')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT: Get current user's wholesale status
// GET /api/v1/users/wholesale/status
// Auth: verifyJWT
// ─────────────────────────────────────────────────────────────────────────────
const getWholesaleStatus = asyncHandler(async (req, res) => {
    const userID = req.user._id

    const user = await User.findById(userID)
        .select('wholesaleStatus customerType')

    if (!user) throw new ApiError(404, 'User not found')

    // Fetch the latest request from the WholesaleRequest collection
    const latestRequest = await WholesaleRequest.findOne({ userId: userID })
        .sort({ submittedAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, {
            wholesaleStatus:  user.wholesaleStatus,
            customerType:     user.customerType,
            wholesaleRequest: latestRequest || null   // null if no request submitted yet
        }, 'Wholesale status fetched')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Get all wholesale requests
// GET /api/v1/users/wholesale/admin/requests?status=pending|approved|rejected|all
// Auth: verifyAdminJWT + isAdmin
// ─────────────────────────────────────────────────────────────────────────────
const getWholesaleRequests = asyncHandler(async (req, res) => {
    const { status } = req.query

    // Filter on WholesaleRequest.status (not User.wholesaleStatus)
    const filter = {}
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        filter.status = status
    }
    // If status=all or no status param, no filter is applied → return everything

    const requests = await WholesaleRequest.find(filter)
        .populate('userId', 'username email customerType companyDetails')  // no password/refreshToken
        .sort({ submittedAt: -1 })  // newest first

    // Reshape to keep admin UI compatible: surface user fields alongside request
    const shaped = requests.map(r => ({
        _id:               r._id,
        userId:            r.userId?._id,          // user ID — needed for admin status update
        username:          r.userId?.username,
        email:             r.userId?.email,
        customerType:      r.userId?.customerType,
        companyDetails:    r.userId?.companyDetails,
        wholesaleStatus:   r.status,
        wholesaleRequest:  {
            businessType:      r.businessType,
            expectedQuantity:  r.expectedQuantity,
            expectedFrequency: r.expectedFrequency,
            city:              r.city,
            storeName:         r.storeName,
            website:           r.website,
            instagramProfile:  r.instagramProfile,
            submittedAt:       r.submittedAt,
            reviewedAt:        r.reviewedAt,
            rejectionReason:   r.rejectionReason
        },
        createdAt:         r.createdAt
    }))

    return res.status(200).json(
        new ApiResponse(200, shaped, 'Wholesale requests fetched')
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Update wholesale status for a user
// PATCH /api/v1/users/wholesale/admin/:userId/status
// Auth: verifyAdminJWT + isAdmin
// Body: { status: 'approved' | 'rejected' | 'none', rejectionReason?: string }
// NOTE: Does NOT apply wholesale pricing — Phase 3 handles that.
// ─────────────────────────────────────────────────────────────────────────────
const updateWholesaleStatus = asyncHandler(async (req, res) => {
    const { userId }          = req.params
    const adminId             = req.user._id
    const { status, rejectionReason } = req.body

    if (!['approved', 'rejected', 'none'].includes(status)) {
        throw new ApiError(400, "Status must be 'approved', 'rejected', or 'none'")
    }

    const user = await User.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')

    // Update the most recent pending/relevant WholesaleRequest document for this user.
    // Targeting the latest one prevents accidentally modifying old historical records.
    const latestRequest = await WholesaleRequest.findOne({ userId })
        .sort({ submittedAt: -1 })

    if (!latestRequest) {
        throw new ApiError(404, 'No wholesale request found for this user')
    }

    // Map 'none' to the closest WholesaleRequest status — treated as rejected
    const requestStatus = status === 'none' ? 'rejected' : status

    latestRequest.status           = requestStatus
    latestRequest.reviewedAt       = new Date()
    latestRequest.reviewedBy       = adminId
    latestRequest.rejectionReason  = (status === 'rejected' && rejectionReason?.trim())
                                        ? rejectionReason.trim()
                                        : null

    await latestRequest.save()

    // Keep User.wholesaleStatus in sync with the admin decision.
    // IMPORTANT — Phase 3 architecture rule:
    // customerType = 'wholesale' is a descriptive label, NOT a pricing trigger.
    // The Phase 3 pricingEngine must evaluate ALL of:
    //   1. User.wholesaleStatus === 'approved'  (from DB, never from JWT)
    //   2. cart/order meets qualification rules (Phase 4 — MOQ/minimum TBD)
    //   3. product.wholesaleRegularPrice is not null
    // Only when all three are satisfied should wholesale pricing apply.
    user.wholesaleStatus = status

    if (status === 'approved') {
        user.customerType = 'wholesale'
    }
    if (status === 'rejected' || status === 'none') {
        user.customerType = 'retail'
    }

    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {
            userId:           user._id,
            username:         user.username,
            wholesaleStatus:  user.wholesaleStatus,
            customerType:     user.customerType,
            requestStatus:    latestRequest.status,
            reviewedAt:       latestRequest.reviewedAt
        }, `Wholesale status updated to '${status}'`)
    )
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Count of pending wholesale requests (for dashboard stat)
// GET /api/v1/users/wholesale/admin/pending-count
// Auth: verifyAdminJWT + isAdmin
// Uses WholesaleRequest collection — not User.wholesaleStatus
// ─────────────────────────────────────────────────────────────────────────────
const getPendingWholesaleCount = asyncHandler(async (req, res) => {
    const count = await WholesaleRequest.countDocuments({ status: 'pending' })

    return res.status(200).json(
        new ApiResponse(200, { pendingWholesaleRequests: count }, 'Pending count fetched')
    )
})

export {
    submitWholesaleRequest,
    getWholesaleStatus,
    getWholesaleRequests,
    updateWholesaleStatus,
    getPendingWholesaleCount
}
