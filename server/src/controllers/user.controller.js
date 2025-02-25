import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'

const generateAccessAndRefreshToken = asyncHandler(async(userId)=>{

})

const registerUser = asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {username, email, password} = req.body;
    console.log("email", email)

    //validation check that not any field will be empty
    if ([username, email, password].some((field) => !field?.trim()))
    {
        throw new ApiError(400, "All fields are required")
    }


const existedUser = await User.findOne({email})

if(existedUser){
    throw new ApiError(409, "User with email already exists")
}
// everythig working fine, create entry in db
const user = await User.create({
    username,
    email,
    password
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(400, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully!! ")
)

})

const loginUser = asyncHandler(async(req,res)=>{

})

const logoutUser = asyncHandler(async(req,res)=>{
    
})
export {registerUser}