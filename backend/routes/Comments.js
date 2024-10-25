import express from 'express'
import { AddComment } from '../controllers/Comments.js'
import { isAdmin } from '../middleware/isAdmin.js'

const CommentRoutes=express.Router()

CommentRoutes.post('/addcomment',isAdmin,AddComment)

export default CommentRoutes