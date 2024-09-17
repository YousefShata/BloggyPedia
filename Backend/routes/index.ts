import UserController from '../Controllers/UserController';
import BlogController from '../Controllers/BlogController';
import multer from 'multer';
import path from 'path';
import { Router } from 'express';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/profile-pics'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Filename format
    }
  });
const upload = multer({ storage });
const router = Router();

router.post('/api/register',upload.single("profilePicture"), UserController.register);
router.post('/api/login', UserController.login);
router.post('/api/logout', UserController.logout);
router.get('/api/check-auth', UserController.checkAuth);
router.post('/api/createBlog', BlogController.createBlog);
router.get('/api/getBlog/:blogId', BlogController.getBlog);
router.get('/api/getAllBlogs', BlogController.getAllBlogs);
router.get('/api/profile', UserController.profile);
router.put('/api/updateProfile',upload.single("profilePicture"), UserController.updateProfile);
router.put('/api/editBlog/:blogId', BlogController.editBlog);
router.get('/api/checkAuthor', BlogController.checkAuthor);
//router.get('/api/login', func);
//router.get('/api/logout', func);

export default router;
