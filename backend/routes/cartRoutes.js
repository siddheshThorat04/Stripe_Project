import express from "express"
import {getCart,addToCart,removeAllFromCart,updateQuantity} from "../controllers/cartControllers.js"
import { protectRoute } from "../middlewares/authMiddlewares.js";
const router= express.Router()

router.get("/",protectRoute,getCart);
router.post("/",protectRoute,addToCart);
router.delete("/:id",protectRoute,removeAllFromCart);
router.put("/:id",protectRoute,updateQuantity);


export default router;