import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';
import dotenv from 'dotenv';
import axios from 'axios';

import {v2 as cloudinary} from 'cloudinary';
import fileUpload from 'express-fileupload';
// import { connect } from 'mongoose';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

//router import
import userRoutes from './Routes/userRoutes.js';
import blogRoutes from './Routes/blogRoutes.js';


connectDB()
//rest object
const app = express();


//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))


// const url = `https://bookrackk.onrender.com`;
// const interval = 30000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       console.log("website reloded");
//     })
    
// }

// setInterval(reloadWebsite, interval);




//routes
app.use("/api/user", userRoutes);
app.use('/api/blog', blogRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//Cloudinary
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });





//listen
app.listen(8000, ()=>{
    console.log("SErver runnung".bgCyan.white); 
})