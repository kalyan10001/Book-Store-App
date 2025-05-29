import express from "express";

const authRouter=express.Router();

authRouter.post("/register",(req,res)=>{
    res.send("register");
})

authRouter.post("/login",(req,res)=>{
    res.send("login");
})

export default authRouter;