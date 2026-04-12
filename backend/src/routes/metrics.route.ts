import { Router } from 'express';
import metricsController from '../controllers/metrics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate(), metricsController.getMetrics);
router.get('/usage-over-time', authenticate(), metricsController.getUsageOverTime);

export default router;
