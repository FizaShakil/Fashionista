import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import User from '../models/user.model.js'

const registerUser = asyncHandler(async(req,res)=>{
    const {username, email, password} = req.body;
    console.log("email", email)

    //validation check that not any field will be empty
if([email, password, username].some((field)=>field?.trim === " "))
    {
        throw new ApiError(400, "All fields are required")
    }


const existedUser = await User.findOne({
    $or:[{username},{email}]
})

if(!existedUser){
    throw new ApiError(409, "User with username or email already exist")
}
// everythig working fine, create entry in db
const user = await User.create({
    username: username.toLowerCase(),
    email,
    password
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(400, "Something went wrong while registering the user")
}

return res.status(200).json(
    new ApiResponse(200, createdUser, "User Registered Successfully!! ")
)
})

export {registerUser}