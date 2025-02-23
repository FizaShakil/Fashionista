import { Router } from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import { uploadProductDetails, deleteProductDetails, updateProductDetails, getProductDetails } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.route('/upload-product-details').post(
    upload.single('productImage'),
    uploadProductDetails
)
productRouter.route('/delete-product-details').post(deleteProductDetails)
productRouter.route('/update-product-details').post(updateProductDetails)
productRouter.route('/grt-product-details').post(getProductDetails)
export default productRouter