import express from "express"
import dotenv from "dotenv"
 

import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js"

dotenv.config()

const app=express()
const port=process.env.PORT

app.get("/",(req,res)=>{
    res.send("hello")
})
app.use("/api/auth",authRoutes)

app.listen(port,()=>{

    console.log(`server is running on port http://localhost:${port} `)
    console.log(process.env.PORT);
    connectDB();

})