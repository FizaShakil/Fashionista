import { Product } from "../models/product.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const uploadProductDetails = asyncHandler(async(req,res)=>{
    const {name, description, price, gender, newArrival} = req.body;
    console.log("Name: ", name)

    if([name, description, price, gender, newArrival].some((field)=>field?.trim === " ")){
        throw new ApiError(400, "All fields are required")
    }

    const productImageLocalPath = req.files?.imageLink?.path;
     
    // image is compulsory
    if(!productImageLocalPath){
        throw new ApiError(400, "Product Image Required")
    }
    
    //upload image from local path to cloudinay
    const productImage = await uploadOnCloudinary(productImageLocalPath)
     
    // check if product image is uploaded or not
    if(!productImage){
        throw new ApiError(400, "Failed to upload Product image on cloudinary")
    }

    // if everything is working fine, create entry in DB
    const product = await Product.create({
        name, 
        description, 
        price, 
        gender,
        imageLink: productImage.url, 
        newArrival
    })

    // check if product created or not

    const uploadedProduct = await Product.findById(product._id)

    if(!uploadedProduct){
        throw new ApiError(500, "Something went wrong while uploading product details")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, uploadedProduct, "Product details uploaded successfully!!")
    )
})

export {uploadProductDetails}