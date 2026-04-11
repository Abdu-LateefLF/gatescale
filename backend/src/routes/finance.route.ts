import { Router } from 'express';
import financeController from '../controllers/finance.controller';
import validateBody from '../middleware/validateBody';
import { generateReportRequestSchema } from '../schemas/finance.schema';
import { validateApiKey } from '../middleware/auth';

const router = Router();

router.post(
    '/generate-report',
    validateApiKey,
    validateBody(generateReportRequestSchema),
    financeController.generateForecast
);

export default router;
