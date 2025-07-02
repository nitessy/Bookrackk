import express from 'express';
// import { uploadPicture } from '../middleware/uploadPictureMiddleware.js';
import {
  createBlogController,
  deleteBlogController,
  getAllBlogsController,
  getBlogbyIdController,
  updateBlogController,
  userBlogController
} from '../controllers/blog-controller.js';
// import { requireSignIn } from '../middlewares/authMiddleware.js'; 
// // 🔐 JWT middleware
import { requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/all-blog', getAllBlogsController);
router.get('/get-blog/:id', getBlogbyIdController);

// Protected routes
router.post('/create-blog', requireSignIn, createBlogController);
router.put('/update-blog/:id',requireSignIn, updateBlogController);
router.delete('/delete-blog/:id', requireSignIn, deleteBlogController);
// router.delete('/delete-blog/:id', deleteBlogController);
router.get('/user-blog/:id', requireSignIn, userBlogController);

export default router;
