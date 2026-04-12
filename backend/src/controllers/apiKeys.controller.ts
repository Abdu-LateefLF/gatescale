import { Request, Response } from 'express';
import { AuthenticationError } from '../utils/error.js';
import apiKeysService from '../services/apiKeys.service.js';

class ApiKeysController {
    async getAllApiKeys(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const apiKeys = await apiKeysService.getApiKeys(userId);
        res.json(apiKeys);
    }

    async createApiKey(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const { name } = req.body;
        const apiKey = await apiKeysService.createApiKey(userId, name);
        res.json(apiKey);
    }

    async revokeApiKey(req: Request, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthenticationError('User not authenticated');
        }

        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid API key ID');
        }

        const result = await apiKeysService.revokeApiKey(userId, id);
        res.json(result);
    }
}

const apiKeysController = new ApiKeysController();
export default apiKeysController;
