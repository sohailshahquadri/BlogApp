import express from 'express';
import dotenv from 'dotenv';
import DBCon from './utils/db.js';


import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';
import BlogsRoutes from './routes/Blog.js';
import CommentRoutes from './routes/Comments.js';
import DashboardRoutes from './routes/Dashboard.js';
import PublicRoutes from './routes/Public.js';


import cors from 'cors'

dotenv.config();
const PORT=process.env.PORT || 3000
const app = express();

//mongodb connections
DBCon()
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());

app.get("/",(rep,res)=>{
  res.send("HI from backend");
})

const corsOptoins={
  origin:true,
  credentials:true
}
app.use(cors(corsOptoins))
app.use('/auth',AuthRoutes)
app.use('/blogs',BlogsRoutes)
app.use('/comment',CommentRoutes)
app.use('/dashboard',DashboardRoutes)
app.use('/public',PublicRoutes)

app.listen(PORT,()=>{
  console.log("Running on 8000!!!")
})