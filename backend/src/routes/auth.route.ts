import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validateBody from '../middleware/validateBody';
import { refreshTokenSchema, registerSchema } from '../schemas/auth.schema';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validateBody(loginSchema), authController.login);

router.post(
    '/refresh-token',
    validateBody(refreshTokenSchema),
    authController.refreshToken
);

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/logout', authController.logout);

export default router;
