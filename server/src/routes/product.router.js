import { Router } from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import { uploadProductDetails, deleteProductDetails, updateProductDetails, getProductDetails } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.route('/upload-product-details').post(
    upload.single('productImage'),
    uploadProductDetails
)
productRouter.route('/delete-product-details').delete(deleteProductDetails)
productRouter.route('/update-product-details').patch(updateProductDetails)
productRouter.route('/get-product-details').get(getProductDetails)

export default productRouter