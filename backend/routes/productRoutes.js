import express from 'express'
import {getAllProducts,getFeaturedProducts,creaeteProduct,deleteProduct,getRecommondedProducts,getCategoryProducts,toggleFeaturedProduct} from  "../controllers/productController.js"
import { protectRoute,adminRoute } from '../middlewares/authMiddlewares.js';
const router =express.Router()


router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/categories/:category",getCategoryProducts);
router.get("/recommendations",getRecommondedProducts);
router.post("/",protectRoute,adminRoute,creaeteProduct);
router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);
export default router;  