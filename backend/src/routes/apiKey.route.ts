import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import apiKeysController from '../controllers/apiKeys.controller';
import validateBody from '../middleware/validateBody';
import { createApiKeyRequestSchema } from '../schemas/apiKeys.schema';

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
