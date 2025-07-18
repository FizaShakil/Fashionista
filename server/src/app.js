import express from "express";
import cors from 'cors'
import cookieParser from'cookie-parser'
import userRouter from './routes/user.router.js'
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import orderRouter from "./routes/order.router.js";


const app = express();

// Middleware and routes
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({
    limit: '16kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static("public"))

app.use(cookieParser())

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/products" , productRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/orders", orderRouter)

export default app;
