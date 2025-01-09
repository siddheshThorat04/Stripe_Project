import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup= async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            res.status(400);
            throw new Error("User already exist");
        }
        if(password.length<6){
            res.status(400);
            throw new Error("Password should be at least 6 characters long");
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            name,
            email,
            password:hashedPassword
        });
        const savedUser=await newUser.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
}
export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            res.status(400);
            throw new Error("User not found");
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400);
            throw new Error("Invalid credentials");
        }
        res.send(user);
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
}
export const logout=async (req,res)=>{
    res.send("logout page")
}
