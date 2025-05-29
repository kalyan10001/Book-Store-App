import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";


const protectRoute=async(req,res,next)=>{
    try {
        const token=req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({message:"No authentication token,access denied"});
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"Token is not valid"});
        }

        req.user=user;
        next();
    } catch (error) {
        console.log("error in protect route middleware",error);
        res.status(400).json({message:"Internal server error"});
    }
};

export default protectRoute;