import { Router } from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import { uploadProductDetails, deleteProductDetails, updateProductDetails, getProductDetails, getSingleProductDetails } from '../controllers/product.controller.js'
import { verifyAdminJWT, verifyJWTOptional } from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'

const productRouter = Router()

// Admin write routes
productRouter.route('/upload-product-details').post(verifyAdminJWT, isAdmin, upload.single('productImage'), uploadProductDetails)
productRouter.route('/add-product-details').post(verifyAdminJWT, isAdmin, upload.single('productImage'), uploadProductDetails)
productRouter.route('/delete-product-details').delete(verifyAdminJWT, isAdmin, deleteProductDetails)
productRouter.route('/update-product-details').patch(verifyAdminJWT, isAdmin, updateProductDetails)

// Public read routes — verifyJWTOptional so pricing is context-aware for logged-in users
// but guests are not blocked
productRouter.route('/get-product-details').get(verifyJWTOptional, getProductDetails)
productRouter.route('/get-single-product-details/:id').get(verifyJWTOptional, getSingleProductDetails)

export default productRouter