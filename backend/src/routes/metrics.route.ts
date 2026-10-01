import { Router } from 'express';
import metricsController from '../controllers/metrics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate(), metricsController.getMetrics);
router.get('/usage-over-time', authenticate(), metricsController.getUsageOverTime);

export default router;
