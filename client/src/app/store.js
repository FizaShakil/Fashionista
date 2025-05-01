import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../Redux/cartSlice'
import useReducer from '../Redux/userSlice'

export const store = configureStore({
    reducer:{
        cart: cartReducer,
        user: useReducer,
    },
})