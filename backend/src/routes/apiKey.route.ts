import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import apiKeysController from '../controllers/apiKeys.controller';
import validateBody from '../middleware/validateBody';
import { CreateApiKeySchema } from '../schemas/apiKeys.schema';

const router = Router();

router.get('/', authenticate(), apiKeysController.getAllApiKeys);

router.post(
    '/',
    authenticate(),
    validateBody(CreateApiKeySchema),
    apiKeysController.createApiKey
);

router.delete('/:id', authenticate(), apiKeysController.revokeApiKey);

export default router;
