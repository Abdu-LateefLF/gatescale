import { Router } from 'express';
import queryController from '../controllers/query.controller.js';
import validateBody from '../middleware/validateBody.js';
import { runQueryRequestSchema } from '../schemas/query.schema.js';
import {
    authenticate,
    validateApiKey,
    validateApiKeyForPlayground,
} from '../middleware/auth.js';
import { apiKeyRateLimiter } from '../middleware/rateLimiter.js';
import { trackApiRequest } from '../middleware/trackApiRequest.js';

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
