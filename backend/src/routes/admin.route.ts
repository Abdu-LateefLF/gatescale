import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate('admin'), adminController.getMetrics);
router.get(
    '/usage-over-time',
    authenticate('admin'),
    adminController.getUsageOverTime
);

export default router;
