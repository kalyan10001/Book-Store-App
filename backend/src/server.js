import express from 'express'
import "dotenv/config"
import authRouter from './routes/auth.routes.js';
import { ConnectToDb } from './lib/db.js';
import bookRouter from './routes/book.routes.js';
import cors from "cors";
import job from './lib/cron.js';

const app=express();
const PORT=process.env.PORT;

job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth",authRouter);
app.use("/api/books",bookRouter);

app.listen(PORT,async()=>{
    console.log(`server running on port ${PORT}`);
    await ConnectToDb();
})