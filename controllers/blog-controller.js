
import blogModel from "../model/blogModel.js";
import userModel from "../model/user.js";
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';

//GET ALL BLOGS

export const getAllBlogsController = async (req, res) =>{
    try{
const blogs = await blogModel.find({}).populate('user');
if(!blogs){
    return res.status(200).send({
        success: false,
        message: "No Blogs here",
    })
}
return res.status(200).send({
     success: true,
    message: "All blogs below",
    blogsCount: blogs.length,
    blogs,
})

    } catch(error){
console.log(error)
return res.status(500).send({
     success: false,
    message: "Error while getting blog",
})
    }
}

export const createBlogController = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    const image = req.files?.image;

    if (!title || !description || !image || !user) {
      return res.status(400).send({
        message: "All fields are not entered",
      });
    }

    const existinguser = await userModel.findById(user);
    if (!existinguser) {
      return res.status(404).send({
        message: "Unable to find user",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloudinaryResponse) {
      console.log("No response from Cloudinary");
      return res.status(500).send({ message: "Image upload failed" });
    }

    if (cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).send({ message: "Cloudinary error", error: cloudinaryResponse.error });
    }
console.log(cloudinaryResponse);
    const newBlog = new blogModel({
      title,
      description,
      user,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url, 
      },
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    await newBlog.save({ session });
    existinguser.blogs.push(newBlog);
    await existinguser.save({ session });
    await session.commitTransaction();
    session.endSession(); // Session ended

//    await newBlog.save();
// existinguser.blogs.push(newBlog);
// await existinguser.save();



    return res.status(201).send({
      message: "Blog created",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while creating blog",
    });
  }
};



// export const updateBlogController = async (req,res) =>{
//     try{
//         const {id} = req.params;
// const {title, description, image, } = req.body;
// const blog = await blogModel.findByIdAndUpdate(id, {...req.body}, {new:true})
// return res.status(200).send({
//     success: true,
//     message:"Updated",
//     blog,
// })
//     }catch(error){
//         console.log(error)
//         return res.status(400).send({
// message: 'Error while updating blog'

//         })
//     }
// }


export const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const imageFile = req.files?.image;

    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;

    if (imageFile) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedFormats.includes(imageFile.mimetype)) {
        return res.status(400).send({ message: "Invalid image format" });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.tempFilePath);

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).send({
          message: "Image upload failed",
          error: cloudinaryResponse?.error || "No response",
        });
      }

      updatedFields.image = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    // If no fields to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).send({
        message: "No fields provided to update.",
      });
    }

    const blog = await blogModel.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).send({
      message: "Error while updating blog",
      error: error.message,
    });
  }
};





export const getBlogbyIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findById(id).populate({
      path: "user",
     
    });

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "No blog found with this ID",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Here is your blog",
      blog,
    });
  } catch (error) {
    console.log("Error in getBlogbyIdController:", error);
    return res.status(500).send({
      success: false,
      message: "Error while finding blog",
      error: error.message,
    });
  }
};


export const deleteBlogController = async (req,res) =>{
    try{
 const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");
 await blog.user.blogs.pull(blog);
 await blog.user.save();
 return res.status(200).send({
    success: true,
    message:"deleted",
 })

    }catch(error){
        console.log(error)
        return res.status(400).send({
message: 'Error while deleting blog'

        })
    }
    
}

export const userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id)
      .populate({
        path: "blogs",
        populate: {
          path: "user",
        },
      });

    if (!userBlog) {
      return res.status(404).send({
        message: "Blogs not found",
      });
    }

    return res.status(200).send({
      message: "Here is your blog",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while fetching blog",
    });
  }
};
