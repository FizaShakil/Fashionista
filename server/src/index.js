import dotenv from 'dotenv'


dotenv.config(
    {
        path: './.env'
    }
)
import app from "./app.js";
import connectDatabase from './db/index.js'
connectDatabase().then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log("App is listening on port ", process.env.PORT)
})