import { Response, Request } from 'express';
import { AuthenticationError } from '../utils/error';
import financeService from '../services/finance.service';

class FinanceController {
    async generateForecast(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const result = financeService.generateForecast(userId);
        res.json(result);
    }
}

const financeController = new FinanceController();
export default financeController;
