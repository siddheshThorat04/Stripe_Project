import express from "express";
import { protectRoute } from "../middlewares/authMiddlewares";
import { validateCoupon ,getCoupon} from "../controllers/couponController";
const router=express.Router()
router.get("/",protectRoute,getCoupon);
router.get("/validate",protectRoute,validateCoupon);

export default router;