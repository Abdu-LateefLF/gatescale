import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validateBody from '../middleware/validateBody';
import {
    refreshTokenRequestSchema,
    registerRequestSchema,
} from '../schemas/auth.schema';
import { loginRequestSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validateBody(loginRequestSchema), authController.login);

router.post(
    '/refresh-token',
    validateBody(refreshTokenRequestSchema),
    authController.refreshToken
);

router.post(
    '/register',
    validateBody(registerRequestSchema),
    authController.register
);

router.post('/logout', authController.logout);

export default router;
