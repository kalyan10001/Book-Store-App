import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/book.schema.js";
import protectRoute from "../middleware/auth.middleware.js";
const bookRouter=express.Router();

bookRouter.post("/",protectRoute,async(req,res)=>{
    try {
        const {title,caption,rating,image}=req.body;

        if(!title || !caption || !rating || !image){
            return res.status(400).json({message:"please provide all fields"});
        }

       const uploadResponse= await cloudinary.uploader.upload(image);
       const imageUrl=uploadResponse.secure_url;

       const newBook=new Book({
        title,
        caption,
        rating,
        image:imageUrl,
        user:req.user._id,
       })

       await newBook.save();
       
       res.status(201).json(newBook);
    } catch (error) {
        console.log("error creating book",error);
        res.status(400).json({message:"Internal server error"});
    }
})

export default bookRouter;