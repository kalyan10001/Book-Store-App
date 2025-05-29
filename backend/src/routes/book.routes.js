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

bookRouter.get("/",protectRoute,async(req,res)=>{
    try {
        const page=req.query.page || 1;
        const limit=req.query.limit || 5
        const skip=(page-1)*limit;

        const books=await Book.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("user","username profileImage");

        const totalBooks=Book.countDocuments();

        res.send({
            books,
            currentPage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks/limit),
        });
    } catch (error) {
        console.log("error in fetching books",error);
        res.status(500).json({message:"internal server error"});
    }
})

bookRouter.delete("/:id",protectRoute,async(req,res)=>{
    try {
        const book=await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }

        if(book.user.toString()!==req.user._id){
            return res.status(401).json({message:"unauthorized"});
        }

        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId=book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error deleting image from cloudinary",error);
            }
        }

        await book.deleteOne();
        res.status(200).json({message:"Book deleted successfully"});

    } catch (error) {
        console.log("error in deleting book route",error);
        res.status(400).json({message:"Internal server error"});
    }
})

export default bookRouter;