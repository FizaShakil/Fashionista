import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from "jsonwebtoken";

const verifyJWT= asyncHandler(async(req,res,next)=>{
    try {
        // For client routes, check accessToken
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid access token. Not able to verify")
    }
})

const verifyAdminJWT = asyncHandler(async(req,res,next)=>{
    try {
        // For admin routes, check adminAccessToken
        const token = req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request (admin)")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken")
    
        if(!user || user.role !== 'admin'){
            throw new ApiError(401, "Invalid admin access token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid admin access token. Not able to verify")
    }
})

export default verifyJWT
export { verifyAdminJWT }