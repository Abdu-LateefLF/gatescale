import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validateBody from '../middleware/validateBody.js';
import { registerRequestSchema } from '../schemas/auth.schema.js';
import { loginRequestSchema } from '../schemas/auth.schema.js';

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
