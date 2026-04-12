import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import apiKeysController from '../controllers/apiKeys.controller.js';
import validateBody from '../middleware/validateBody.js';
import { createApiKeyRequestSchema } from '../schemas/apiKeys.schema.js';

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
