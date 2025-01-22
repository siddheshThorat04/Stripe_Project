import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()


cloudinary.config({
    cloud_name:process.env.ClOUDINARY_API_SECRET,
    api_key:process.env.ClOUDINARY_API_KEY,
    api_secret:process.env.ClOUDINARY_CLOUD_NAME
})

export default cloudinary;