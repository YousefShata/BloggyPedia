import UserController from '../Controllers/UserController';
import { Router } from 'express';
import User from '../Models/User';

const router = Router();

router.post('/api/register', UserController.register);
router.post('/api/login', UserController.login);
router.post('/api/logout', UserController.logout);
//router.get('/api/login', func);
//router.get('/api/logout', func);

export default router;