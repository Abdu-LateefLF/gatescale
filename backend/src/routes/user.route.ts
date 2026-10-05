import { Router } from 'express';
import userController from '../controllers/user.controller.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/profile', authenticate(), userController.getUserProfile);

export default router;
