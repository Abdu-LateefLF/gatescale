import { Request, Response } from 'express';
import apiRequestLogsRepository, {
    TimeRange,
} from '../repository/ApiRequestLogsRepository.js';

const VALID_RANGES: TimeRange[] = ['24h', '7d', '30d'];

class AdminController {
    async getMetrics(req: Request, res: Response) {
        const metrics = await apiRequestLogsRepository.getAdminMetrics();
        res.json(metrics);
    }

    async getUsageOverTime(req: Request, res: Response) {
        const range = req.query.range as string;

        if (!VALID_RANGES.includes(range as TimeRange)) {
            return res
                .status(400)
                .json({ error: 'Invalid range. Use 24h, 7d, or 30d.' });
        }

        const data = await apiRequestLogsRepository.getAdminUsageOverTime(
            range as TimeRange
        );
        res.json(data);
    }
}

const adminController = new AdminController();
export default adminController;
