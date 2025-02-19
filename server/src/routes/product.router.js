import { Router } from 'express'
import upload from '../middlewares/multer.middleware.js'
import { uploadProductDetails } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.route('/upload-product-details').post(
    upload.single('productImage'),
    uploadProductDetails
)
export default productRouter