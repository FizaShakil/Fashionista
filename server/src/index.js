import dotenv from "dotenv"
import connectDatabase from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: './.env'
})

// Validate required environment variables
const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Log environment info
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('CORS Origin:', process.env.CORS_ORIGIN || 'Not set');

connectDatabase()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })