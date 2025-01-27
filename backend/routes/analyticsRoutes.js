import express from "express";
import { adminRoute, protectRoute } from "../middlewares/authMiddlewares";
import { getAnalyticsData } from "../controllers/analyticsController";

const router =express.Router()


router.get("/",protectRoute,adminRoute,async(req,res)=>{
    try {
        const analyticsData=getAnalyticsData()
        const endDate=new Date();
        const startDate= new Date(endDate.getTime()-7*24*60*60*1000);
        
        const dailySalesData= await getDailySalesData(startDate,endDate)
        res.json({analyticsData,dailySalesData})
    } catch (error) {
        console.log("Error in getting analytics data");
        res.status(500).json({message:"Server Error",error:error.message}) 
    }
})


export default router;