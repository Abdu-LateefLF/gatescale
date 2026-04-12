import { Request, Response, NextFunction } from 'express';
import cacheKeys from '../cache/cacheKeys.js';
import cacheClient from '../cache/cacheClient.js';
import { SubscriptionTier } from '../db/types.js';
import { validate as uuidValidate } from 'uuid';

export function userRateLimiter(maxRequests: number, windowSeconds: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;
        if (!ip) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = cacheKeys.getUserRateLimitKey(ip);
        try {
            const current = await cacheClient.incr(key);
            if (current === 1) {
                await cacheClient.expire(key, windowSeconds);
            }

            if (current && current > maxRequests) {
                return res.status(429).json({ error: 'Too many requests' });
            }

            next();
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

export async function apiKeyRateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.apiKeyId) {
        return res.status(401).json({ error: 'Missing API key' });
    }

    const keyId = req.apiKeyId;
    const key = cacheKeys.getApiKeyRateLimitKey(keyId);

    const userTier = req.user?.tier as SubscriptionTier | undefined;
    if (!userTier) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const maxRequests = userTier === 'free' ? 100 : 1000;
    const windowSeconds = 3600; // 1 hr

    try {
        const current = await cacheClient.incr(key);
        if (current === 1) {
            await cacheClient.expire(key, windowSeconds);
        }

        if (current && current > maxRequests) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const globalRateLimiter = userRateLimiter(100, 60 * 3);

export default userRateLimiter;
