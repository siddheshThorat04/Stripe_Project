import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import { connectDB } from "./lib/db.js"

dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(cookieParser())
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello")
})
app.use("/api/auth",authRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)

app.listen(port,()=>{

    console.log(`server is running on port http://localhost:${port} `)
    console.log(process.env.PORT);
    connectDB();

})