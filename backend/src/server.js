import express from 'express'
import "dotenv/config"
import authRouter from './routes/auth.routes.js';

const app=express();
const PORT=process.env.PORT;

app.use("/api/auth",authRouter);

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})