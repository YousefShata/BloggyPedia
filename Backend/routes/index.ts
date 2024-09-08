import UserController from '../Controllers/UserController';
import { Router } from 'express';

const router = Router();

router.post('/api/register', UserController.register);
router.post('/api/login', UserController.login);
//router.post('/api/logout', func);
//router.get('/api/login', func);
//router.get('/api/logout', func);

export default router;