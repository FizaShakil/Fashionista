import { Router } from 'express'
import {
    createCategory,
    updateCategory,
    deactivateCategory,
    getActiveCategories,
    getAllCategories,
    getCategoryBySlug
} from '../controllers/category.controller.js'
import { verifyAdminJWT, verifyJWTOptional } from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'

const categoryRouter = Router()

// ── Public ────────────────────────────────────────────────────────────────────
categoryRouter.route('/').get(getActiveCategories)
categoryRouter.route('/all').get(verifyAdminJWT, isAdmin, getAllCategories)
categoryRouter.route('/:slug').get(getCategoryBySlug)

// ── Admin write ───────────────────────────────────────────────────────────────
categoryRouter.route('/').post(verifyAdminJWT, isAdmin, createCategory)
categoryRouter.route('/:id').patch(verifyAdminJWT, isAdmin, updateCategory)
categoryRouter.route('/:id').delete(verifyAdminJWT, isAdmin, deactivateCategory)

export default categoryRouter
