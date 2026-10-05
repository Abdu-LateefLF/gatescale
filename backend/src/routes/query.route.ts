import { Router } from 'express';
import queryController from '../controllers/query.controller.ts';
import validateBody from '../middleware/validateBody.ts';
import { runQueryRequestSchema } from '../schemas/query.schema.ts';
import {
    authenticate,
    validateApiKey,
    validateApiKeyForPlayground,
} from '../middleware/auth.ts';
import { apiKeyRateLimiter } from '../middleware/rateLimiter.ts';
import { trackApiRequest } from '../middleware/trackApiRequest.ts';

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
