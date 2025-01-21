import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js"
const generateToken = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken }; 
}
const storeRefreshToken = async (id, refreshToken) => {
    await redis.set(`refresh_token:${id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })
}
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            res.status(400);
            throw new Error("User already exist");
        }
        if (!name || !email || !password) {
            throw new Error("All feilds are required");
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error("Password should be at least 6 characters long");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const { accessToken, refreshToken } = generateToken(newUser._id);
        await storeRefreshToken(newUser._id, refreshToken);
        setCookies(res, accessToken, refreshToken); 
        const savedUser = await newUser.save();
        res.status(201).json({
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }, message: "signed up successfully"
        });
    } catch (error) {
        console.log("Error in signup controller");
        res.status(400);
        res.send(error.message);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            throw new Error("Invalid credentials");
        }
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken); 
        res.send(user);
    } catch (error) {
        console.log("Error in login controller");
        res.status(400);
        res.send(error.message);
    }
}
export const logout = async (req, res) => {
    try {
        const refreshToken=req.cookies.refreshToken;
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.id}`)
        }
        res.clearCookie("refreshToken")
        res.clearCookie("accessToken")
        res.json({message:"logged out succesfully"})
    } catch (error) {
        console.log("Error in logout controller");
        res.status(400).json({error:error.message});

    }
}
