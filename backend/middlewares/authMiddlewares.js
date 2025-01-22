import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ error: error.message   })
        }
        try {

            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
            const user = await User.findById(decoded.id)
            if (!user) {
                return res.status(401).json({ error: "USer NOt Found" });
            }
            req.user = user;
            next()
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Unauthorized-Access token expired" })
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute Middlwaree", error.message);
        res.status(401).json({ message: "unauthorized- Invalid Access Token" });

    }
}
export const adminRoute=async (req,res,next)=>{
        if(req.user && req.user.role==="admin"){
            next()
        } else{
        return res.status(403).json({error:"Access Denied- Only Admin can Do this"});
    }
}