import { Product } from "../models/product.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import path from "path"
import {ApiResponse} from '../utils/ApiResponse.js'

const uploadProductDetails = asyncHandler(async(req,res)=>{
    const {name, productUniqueID, description, price, gender, newArrival} = req.body;
    console.log("Name: ", name)

    if ([name, productUniqueID, description, price, gender, newArrival].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required")
    }

    const productImageLocalPath = path.join(process.cwd(), req.file?.path).replace(/\\/g, "/");

    if(!productImageLocalPath){
        throw new ApiError(400, "Product Image Required")
    }

    console.log('Product image local path before upload: ', productImageLocalPath)
    
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
const updateProductDetails = asyncHandler(async (req, res) => {
    const { productUniqueID, name, description, price, gender, newArrival } = req.body;

    // Check if productUniqueID is provided
    if (!productUniqueID) {
        throw new ApiError(400, "Product Unique ID is required!");
    }

    // Find product by productUniqueID
    const product = await Product.findOne({ productUniqueID });

    // If product not found, return error
    if (!product) {
        throw new ApiError(404, "Product not found with the given Unique ID");
    }

    // Update only the fields that are provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (gender) product.gender = gender;
    if (newArrival !== undefined) product.newArrival = newArrival;

    // Save the updated product
    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product details updated successfully!"));
});


//delete product details
const deleteProductDetails = asyncHandler(async(req,res)=>{

    //give product unique id to delete
    const {productUniqueID} = req.body;
     
    //if product unique id is not given, throw error
    if(!productUniqueID){
        throw new ApiError(400, "Product's unique ID is required to delete")
    }
    
    //delete product
    const product= await Product.findOneAndDelete({productUniqueID})
    
    // if no product exist, throw error
    if(!product){
        throw new ApiError(400, "Product ID not found")
    }

    //return response
    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product deleted successfully!")
    )
})

// Get product details
const getProductDetails = asyncHandler(async(req,res)=>{
    
    //query request from frontend
    const {gender, newArrival, search, price} = req.query

    const filter = {}

    if(gender) filter.gender = gender;
    if(price) filter.price = price;
    if(newArrival) filter.newArrival = newArrival === "true";
    if(search) filter.name = {$regex: "search", $options: "i"}
   
    const products = await Product.find(filter)
    .select("name price description gender newArrival productImage ")
    
    if(!products){
        throw new ApiError(500, "Something went wrong while getting products")
    }
    //return response
    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "Products fetched successfully!")
    ) 
})
export {
    uploadProductDetails,
    updateProductDetails,
    deleteProductDetails,
    getProductDetails
}