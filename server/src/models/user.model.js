import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken:{
        type: String
    }
}, {timestamps:true})

export const User = mongoose.model("User", userSchema)