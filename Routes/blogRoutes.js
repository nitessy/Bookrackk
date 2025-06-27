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
router.post('/create-blog', createBlogController);
router.put('/update-blog/:id', requireSignIn, updateBlogController);
router.delete('/delete-blog/:id', requireSignIn, deleteBlogController);
router.get('/user-blog/:id', userBlogController);

export default router;
