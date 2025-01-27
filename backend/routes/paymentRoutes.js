import express from 'express'
import { protectRoute } from '../middlewares/authMiddlewares';
import { creatCheckOutSession } from '../controllers/paymentController';
import { stripe } from '../lib/stripe';
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
const router =express.Router()


router.post("/crete-checkout-session",protectRoute,creatCheckOutSession)
router.post("/checkout-success",protectRoute,async (req,res)=>{
    try {
        const {sessionId }=req.body;
        const session=await stripe.checkout.sessions.retrieve(sessionId);
        if(session.payment_status==="paid"){
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({code:session.metadata.couponCode},{isActive:false}) 

            }
            const products=JSON.parse(session.metadata.products)
            const newOrder=new Order({
                user:session.metadata.userId,
                products:products.map(product=>({
                    product:product.id,
                    quantity:product.quantity,
                    price:product.price

                })),
                totalAmout:session.amount_total/100,
                stripeSessionId:sessionId
            })
            await newOrder.save();
            res.json({message:"Order Placed Successfully",orderId:newOrder._id});
        }
    } catch (error) {
        console.log("Error in checkout success",error.message);
        res.status(400).json({message:"Server Error",orderId:error.message});
    }
});



export default router;