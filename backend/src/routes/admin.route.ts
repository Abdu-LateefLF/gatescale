import { Router } from 'express';
import adminController from '../controllers/admin.controller.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/', authenticate('admin'), adminController.getMetrics);
router.get(
    '/usage-over-time',
    authenticate('admin'),
    adminController.getUsageOverTime
);

export default router;
