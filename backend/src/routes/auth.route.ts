import { Router } from 'express';
import authController from '../controllers/auth.controller.ts';
import validateBody from '../middleware/validateBody.ts';
import { registerRequestSchema } from '../schemas/auth.schema.ts';
import { loginRequestSchema } from '../schemas/auth.schema.ts';

const router = Router();

router.post('/login', validateBody(loginRequestSchema), authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post(
    '/register',
    validateBody(registerRequestSchema),
    authController.register
);

router.post('/logout', authController.logout);

export default router;
