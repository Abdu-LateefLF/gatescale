import { Router } from 'express';
import { authenticate } from '../middleware/auth.ts';
import apiKeysController from '../controllers/apiKeys.controller.ts';
import validateBody from '../middleware/validateBody.ts';
import { createApiKeyRequestSchema } from '../schemas/apiKeys.schema.ts';

const router = Router();

router.get('/', authenticate(), apiKeysController.getAllApiKeys);

router.post(
    '/',
    authenticate(),
    validateBody(createApiKeyRequestSchema),
    apiKeysController.createApiKey
);

router.delete('/:id', authenticate(), apiKeysController.revokeApiKey);

export default router;
