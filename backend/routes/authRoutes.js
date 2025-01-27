import express from "express";
import { signup, login, logout,refreshToken, getProfile } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddlewares.js";

const router=express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/refresh-token",refreshToken)
router.get("/profile",protectRoute,getProfile)
    
export default router;


// accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGZhYmQ4MDA0OTBmMGU1ODA2MjMwNCIsImlhdCI6MTczNzQ3NjQ0OCwiZXhwIjoxNzM3NDc3MzQ4fQ.9uEtrJjJ0OQLWyNNmq3gWeCLSf-MtGTpu8EbLwn8i88; Path=/; HttpOnly; Expires=Tue, 21 Jan 2025 16:35:48 GMT;
// accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGZhYmQ4MDA0OTBmMGU1ODA2MjMwNCIsImlhdCI6MTczNzQ3NjQ0OCwiZXhwIjoxNzM3NDc3MzQ4fQ.9uEtrJjJ0OQLWyNNmq3gWeCLSf-MtGTpu8EbLwn8i88; Path=/; HttpOnly; Expires=Tue, 21 Jan 2025 16:35:48 GMT;