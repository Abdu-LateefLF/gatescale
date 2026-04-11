import { Response, Request } from 'express';
import { AuthenticationError } from '../utils/error';
import financeService from '../services/finance.service';
import { GenerateReportRequest } from '../schemas/finance.schema';

class FinanceController {
    async generateForecast(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('Application not authenticated');
        }

        const input = req.body as GenerateReportRequest;

        const result = financeService.generateForecast(input);
        res.json(result);
    }
}

const financeController = new FinanceController();
export default financeController;
