import mongoose from "mongoose";
import dotenv from 'dotenv';

const connectDB = async () =>{
try{
await mongoose.connect(process.env.URL)
console.log("Connecttttteeeeedddddd");
} 
catch(error){
    console.log('first');
}



}
// module.exports = connectDB;
export default connectDB;