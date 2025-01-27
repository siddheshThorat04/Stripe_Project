import express from 'express'
import { protectRoute } from '../middlewares/authMiddlewares';
import { creatCheckOutSession } from '../controllers/paymentController';
const router =express.Router()


router.post("/crete-checkout-session",protectRoute,creatCheckOutSession)



export default router;