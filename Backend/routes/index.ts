import UserController from '../Controllers/UserController';
import BlogController from '../Controllers/BlogController';
import { Router } from 'express';

const router = Router();

router.post('/api/register', UserController.register);
router.post('/api/login', UserController.login);
router.post('/api/logout', UserController.logout);
router.get('/api/check-auth', UserController.checkAuth);
router.post('/api/createBlog', BlogController.createBlog);
router.get('/api/getBlog/:id', BlogController.getBlog);
router.get('/api/getAllBlogs', BlogController.getAllBlogs);
//router.get('/api/login', func);
//router.get('/api/logout', func);

export default router;
