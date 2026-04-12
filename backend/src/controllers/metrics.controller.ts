import { Request, Response } from 'express';
import apiRequestLogsRepository, {
    TimeRange,
} from '../repository/ApiRequestLogsRepository.js';

const VALID_RANGES: TimeRange[] = ['24h', '7d', '30d'];

class MetricsController {
    async getMetrics(req: Request, res: Response) {
        const userId = req.user!.userId;
        const metrics =
            await apiRequestLogsRepository.getMetricsByUserId(userId);
        res.json(metrics);
    }

    async getUsageOverTime(req: Request, res: Response) {
        const userId = req.user!.userId;
        const range = req.query.range as string;

        if (!VALID_RANGES.includes(range as TimeRange)) {
            return res
                .status(400)
                .json({ error: 'Invalid range. Use 24h, 7d, or 30d.' });
        }

        const data = await apiRequestLogsRepository.getUsageOverTime(
            userId,
            range as TimeRange
        );
        res.json(data);
    }
}

const metricsController = new MetricsController();
export default metricsController;
