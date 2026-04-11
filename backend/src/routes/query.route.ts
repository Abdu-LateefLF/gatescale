import { Router } from 'express';
import queryController from '../controllers/query.controller';
import validateBody from '../middleware/validateBody';
import { runQueryRequestSchema } from '../schemas/query.schema';
import { validateApiKey } from '../middleware/auth';

const router = Router();

router.post(
    '/run',
    validateApiKey,
    validateBody(runQueryRequestSchema),
    queryController.run
);

export default router;
