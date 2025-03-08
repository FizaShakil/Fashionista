import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await user.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save(({
            validateBeforeSave: false
        })
    )
    return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

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
    const {email, password} = req.body;

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.find({email});

    if(!user){
        throw new ApiError(404, "User not found")
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user Credentials")
    }

    //generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = User.findById(user._id)
    .select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully!! "
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    
})
export {registerUser, loginUser, generateAccessAndRefreshToken}