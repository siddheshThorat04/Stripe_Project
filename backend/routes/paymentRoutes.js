import express from 'express'
import { protectRoute } from '../middlewares/authMiddlewares';
import { creatCheckOutSession, checkOutSuccess } from '../controllers/paymentController';

const router =express.Router()


router.post("/crete-checkout-session",protectRoute,creatCheckOutSession)
router.post("/checkout-success",protectRoute,checkOutSuccess);



export default router;