import express from "express";
import User from "../models/user.schema.js";
import jwt from "jsonwebtoken";

const authRouter=express.Router();

const generateToken=(userId)=>{
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:"15d"}
    );
}

authRouter.post("/register",async(req,res)=>{
    try {
        const {email,username,password}=req.body;

        if(!email || !username || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"password should be min 6 characters"});
        }
        if(username.length < 3){
            return res.status(400).json({message:"username should be min 3 characters"});
        }

        const existingEmail=await  User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"email Already exists"});
        }

        const existingUsername=await  User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message:"username Already exists"});
        }

        const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user=new User({
            email,
            username,
            password,
            profileImage,
        })

        await user.save();

        const token=await generateToken(user._id);
        res.status(201).json({
            token,
            user:{
                id:user._id,
                username:user.username,
                profileImage:user.profileImage,
                email:user.email,
                createdAt:user.createdAt
            },
        });
    } catch (error) {
        console.log("Error in Register route",error);
        res.status(500).json({message:"Internal Server error"});
    }
})

authRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        
        if(!email || !password){
            return res.status(400).json({message:"All Fields are required"});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User Not exists"});
        }

        const ispasswordCorrect=await user.comparePassword(password);
        if(!ispasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token=generateToken(user._id);
        res.status(200).json({
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            }
        });
    } catch (error) {
        console.log("rrror in Login route",error);
        res.status(500).json({message:"Internal server error"});
    }
})

export default authRouter;