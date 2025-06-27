import user from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';

export const getAllUsers =  async (req, res) => { 
    try{
      const users = await user.find({}) ;  
return res.status(200).send({
userCount: users.length,
message: "Here we go",
users



})

    } catch(error){
        console.log(error)
        return res.status(500).send({
            message: "Error in getting",
        })
    }
};





export const registerController = async (req,res) => { 
    try{
    const {username, email, password} = req.body;
    const {image} = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if(!allowedFormats.includes(image.mimetype)){
      return res.status(400).json({message: "Invalid format"});
    }

    // validation
    if(!username || !email || !password){
        return res.status(400).send({
            message: "Please fill",
        })
    }
// existing user
const existinguser = await user.findOne({email})
if(existinguser){
    return res.status(401).send({
        message: "Error in regggister callback",
    })
}

//hashing the password
const hashedPassword = await bcrypt.hash(password, 10)
// password = hashedPassword;

const cloudinaryResponse = await cloudinary.uploader.upload(
image.tempFilePath

)

if(!cloudinaryResponse){
    console.log("No response from Cloudinary");
}
if(cloudinaryResponse.error){
console.log(cloudinaryResponse.error);

}


// save new user
const newUser = new user({username,email,password: hashedPassword, image:{
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.url,
}});
await newUser.save();
return res.status(201).send({
        message: "Congrats",
        newUser,
    })

    } catch(error){
        console.log(error)
        return res.status(500).send({
           message: "Error in register"
        })
    }
};





export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(401).send({
        message: "Please fill all credentials",
        success: false,
      });
    }

    // check if user exists
    const existinguser = await user.findOne({ email });
    if (!existinguser) {
      return res.status(200).send({
        message: "Email is not registered",
        success: false,
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, existinguser.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid username or password",
        success: false,
      });
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
     
    );

    // send response
    return res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      token, // 🔐 token added here
      user: {
        id: existinguser._id,
        username: existinguser.username,
        email: existinguser.email,
        image: existinguser.image.url,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in login callback",
      success: false,
    });
  }
};
