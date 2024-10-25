import Blgomodel from "../models/Blog.js"

import fs from 'fs';
import path from 'path';


const Create=async(req,res)=>{
  try {
    const { title,desc}=req.body
   const imagePath = req.file.filename;
   const CreateBlog = new Blgomodel({
    title,
    desc,
    image:imagePath
   })
   await CreateBlog.save()
   return res.status(200).json({success:true,message:"Post Created Suceesfully",post:CreateBlog})
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal server error" });

  }

}

const deletepost=async(req,res)=>{
  try {
    const postid=req.params.id
    const posts= await Blgomodel.findById(postid)
   
    if (!posts) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    if (posts.image) {
        const profilePath = path.join('public/images', posts.image);
        fs.promises.unlink(profilePath)
            .then(() => console.log('Profile image deleted'))
            .catch(err => console.error('Error deleting profile image:', err));
    }
    const deletepost=await Blgomodel.findByIdAndDelete(postid)
    res.status(200).json({ success: true, message:"Post Delete Successfully",  post:deletepost });

} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
}

const getpost=async(req,res)=>{
  try {
    const posts= await Blgomodel.find()
    if (!posts) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
      
    }
    res.status(200).json({ success: true,post:posts });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });

  }
}
const update = async (req, res) => {
  try {
      const { title, desc } = req.body;
      const blogId = req.params.id;

      const blogToUpdate = await Blgomodel.findById(blogId);
      if (!blogToUpdate) {
          return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      if (title) blogToUpdate.title = title;
      if (desc) blogToUpdate.desc = desc;
      if (req.file) blogToUpdate.image = req.file.filename;

      await blogToUpdate.save();
      res.status(200).json({ success: true, message: 'Blog updated successfully', blog: blogToUpdate });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export {Create,deletepost,getpost,update}