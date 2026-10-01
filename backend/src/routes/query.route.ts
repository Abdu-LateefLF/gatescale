import { Router } from 'express';
import queryController from '../controllers/query.controller';
import validateBody from '../middleware/validateBody';
import { runQueryRequestSchema } from '../schemas/query.schema';
import {
    authenticate,
    validateApiKey,
    validateApiKeyForPlayground,
} from '../middleware/auth';
import { apiKeyRateLimiter } from '../middleware/rateLimiter';
import { trackApiRequest } from '../middleware/trackApiRequest';

const router = Router();

router.post(
    '/run',
    validateApiKey,
    apiKeyRateLimiter,
    trackApiRequest,
    validateBody(runQueryRequestSchema),
    queryController.run
);

router.post(
    '/run-playground/:apiKeyId',
    authenticate(),
    validateApiKeyForPlayground,
    apiKeyRateLimiter,
    trackApiRequest,
    validateBody(runQueryRequestSchema),
    queryController.run
);

export default router;
