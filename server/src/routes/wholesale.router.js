import { Router } from 'express'
import {
    submitWholesaleRequest,
    getWholesaleStatus,
    getWholesaleRequests,
    updateWholesaleStatus,
    getPendingWholesaleCount
} from '../controllers/wholesale.controller.js'
import verifyJWT, { verifyAdminJWT } from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'

const wholesaleRouter = Router()

// ── Client routes (authenticated retail user) ────────────────────────────────
wholesaleRouter.route('/request').post(verifyJWT, submitWholesaleRequest)
wholesaleRouter.route('/status').get(verifyJWT, getWholesaleStatus)

// ── Admin routes ─────────────────────────────────────────────────────────────
wholesaleRouter.route('/admin/requests').get(verifyAdminJWT, isAdmin, getWholesaleRequests)
wholesaleRouter.route('/admin/pending-count').get(verifyAdminJWT, isAdmin, getPendingWholesaleCount)
wholesaleRouter.route('/admin/:userId/status').patch(verifyAdminJWT, isAdmin, updateWholesaleStatus)

export default wholesaleRouter
