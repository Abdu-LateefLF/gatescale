import { Router } from 'express';
import metricsController from '../controllers/metrics.controller.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/', authenticate(), metricsController.getMetrics);
router.get('/usage-over-time', authenticate(), metricsController.getUsageOverTime);

export default router;
