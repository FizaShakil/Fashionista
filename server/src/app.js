import express from "express";
import cors from 'cors'
import cookieParser from'cookie-parser'
import userRouter from './routes/user.router.js'
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import orderRouter from "./routes/order.router.js";
import dashboardRouter from './routes/dashboard.router.js';


const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// Middleware and routes
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

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
app.use('/api/v1/dashboard', dashboardRouter);

export default app;
