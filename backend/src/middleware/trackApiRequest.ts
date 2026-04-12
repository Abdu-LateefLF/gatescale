import { Request, Response, NextFunction } from 'express';
import apiRequestLogsRepository from '../repository/ApiRequestLogsRepository.js';

export function trackApiRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const startTime = Date.now();

    res.on('finish', () => {
        const apiKeyId = req.apiKeyId;
        if (!apiKeyId) return;

        const durationMs = Date.now() - startTime;

        apiRequestLogsRepository
            .insert({
                apiKeyId,
                statusCode: res.statusCode,
                durationMs,
                path: req.path,
            })
            .catch((err) => {
                console.error('Failed to log API request:', err);
            });
    });

    next();
}
