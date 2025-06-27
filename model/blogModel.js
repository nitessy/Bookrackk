import mongoose, { Mongoose } from "mongoose";

const blogSchema = new mongoose.Schema({
title:{
 type: String,
   require: [true, "Title is required"]
},

description:{
 type: String,
   require: [true, "Desc is required"]
},
image:{
public_id:{
  type: String,
  required: true,
},
url:{
  type: String,
  required: true,
},

},
user: {
type: mongoose.Types.ObjectId,
ref: "User",
require: [true, "user id required"]

}


},{timestamps: true})

const blogModel = mongoose.model('Blogs', blogSchema);

export default blogModel;