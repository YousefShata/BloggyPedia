import UserController from '../Controllers/UserController';
import BlogController from '../Controllers/BlogController';
// import {
//   likeBlog,
//   unlikeBlog,
//   getUserLikedBlogs,
// } from '../controllers/LikeController';
import multer from 'multer';
import path from 'path';
import { Router } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/profile-pics'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename format
  },
});
const upload = multer({ storage });
const router = Router();

router.post(
  '/api/register',
  upload.single('profilePicture'),
  UserController.register,
);
router.post('/api/login', UserController.login);
router.post('/api/logout', UserController.logout);
router.get('/api/check-auth', UserController.checkAuth);
router.post('/api/createBlog', BlogController.createBlog);
router.get('/api/getBlog/:blogId', BlogController.getBlog);
router.get('/api/getAllBlogs', BlogController.getAllBlogs);
router.get('/api/profile', UserController.profile);
router.put(
  '/api/updateProfile',
  upload.single('profilePicture'),
  UserController.updateProfile,
);
router.post('/api/favourite/:blogId', UserController.favouriteBlog);
router.put('/api/editBlog/:blogId', BlogController.editBlog);
router.get('/api/checkAuthor', BlogController.checkAuthor);
router.delete('/api/deleteBlog/:blogId', BlogController.deleteBlog);
router.delete('/api/deleteProfile', UserController.deleteProfile);
router.get('/api/getUserBlogs/:userId', BlogController.getUserBlogs);
router.get('/api/search', BlogController.searchBlog);
// router.post('/api/favourite/:blogId', BlogController.likeBlog);
// router.delete('/api/favourite/:blogId', BlogController.unlikeBlog);
// router.get('/api/favourites', BlogController.getUserLikedBlogs);
export default router;
