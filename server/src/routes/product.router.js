import { Router } from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import { uploadProductDetails, deleteProductDetails, updateProductDetails, getProductDetails, getSingleProductDetails } from '../controllers/product.controller.js'
import { verifyAdminJWT } from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'

const productRouter = Router()

productRouter.route('/upload-product-details').post(
    upload.single('productImage'),
    uploadProductDetails
)
productRouter.route('/delete-product-details').delete(verifyAdminJWT,isAdmin,deleteProductDetails)
productRouter.route('/update-product-details').patch(updateProductDetails)
productRouter.route('/get-product-details').get(getProductDetails)
productRouter.route('/get-single-product-details/:id').get(getSingleProductDetails)

export default productRouter