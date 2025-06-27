import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true
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

blogs: [{
type: mongoose.Types.ObjectId,
ref: 'Blogs',

}]


},{timestamps:true})

const user = mongoose.model('User', userSchema);

export default user;