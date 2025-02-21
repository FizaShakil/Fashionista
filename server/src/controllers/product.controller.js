import { Product } from "../models/product.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const uploadProductDetails = asyncHandler(async(req,res)=>{
    const {name, description, price, gender, newArrival} = req.body;
    console.log("Name: ", name)

    if([name, productUniqueID, description, price, gender, newArrival].some((field)=>field?.trim === " ")){
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
        productUniqueID,
        description, 
        price, 
        gender,
        productImage: productImage.url, 
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

//update product details
const updateProductDetails = asyncHandler(async(req,res)=>{
    const {name, description, price, gender, newArrival} = req.body;   
    
    const product = await Product.findByIdAndUpdate(
        req.product?._id,
        {
            $set:{
                name, 
                description, 
                price, 
                gender, 
                newArrival
            }
        },
        {new: true}
    )
    // If product not found, throw error
    if(!product){
        throw new ApiError(400, "Product not found!")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "User details updated successfully!! ")
    )
})

//delete product details
const deleteProductDetails = asyncHandler(async(req,res)=>{

    //give product unique id to delete
    const {productUniqueID} = req.body;
     
    //if product unique id is not given, throw error
    if(!productUniqueID){
        throw new ApiError(400, "Product's unique ID is required to delete")
    }
    
    //delete product
    const product = await Product.findByIdAndDelete(req.product._id)
    
    // if no product exist, throw error
    if(!product){
        throw new ApiError(400, "Product ID not found")
    }

    //return response
    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "User account deleted successfully!")
    )
})

// Get product details
const getProductDetails = asyncHandler(async(req,res)=>{

    const {productUniqueID} = req.body;
     if(!productUniqueID){
        throw new ApiError(400, "Product Unique ID required to get the product")
     }
      const product = Product.findById(req.product?._id)

    // if no product exist, throw error
    if(!product){
        throw new ApiError(400, "Product ID not found")
    }

    //return response
    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "User found successfully!")
    ) 
})
export {
    uploadProductDetails,
    updateProductDetails,
    deleteProductDetails,
    getProductDetails
}