import express from 'express';
import { Create, deletepost, getpost, update } from '../controllers/Blog.js';
import { isAdmin } from '../middleware/isAdmin.js';
import upload from '../middleware/Multer.js';

const BlogsRoutes=express.Router();
BlogsRoutes.post('/create',isAdmin,upload.single('postimage'),Create)
BlogsRoutes.delete('/delete/:id',isAdmin,deletepost)
BlogsRoutes.get('/getpost',getpost)
BlogsRoutes.patch('/update/:id',isAdmin,upload.single('posting'),update)

export default BlogsRoutes