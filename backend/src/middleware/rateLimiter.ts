import { Request, Response, NextFunction } from 'express';
import cacheKeys from '../cache/cacheKeys.js';
import cacheClient from '../cache/cacheClient.js';
import { SubscriptionTier } from '../db/types.js';
import apiKeysRepository from '../repository/ApiKeysRepository.js';
import userRepository from '../repository/UserRepository.js';
import { calculateResetTimeByDayEnd } from '../utils/ratelimit.js';

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

            const ttl = await cacheClient.ttl(key);
            const resetTime = Math.floor(Date.now() / 1000) + ttl;

            res.setHeader('X-RateLimit-Limit', maxRequests.toString());
            res.setHeader(
                'X-RateLimit-Remaining',
                Math.max(0, maxRequests - current).toString()
            );
            res.setHeader('X-RateLimit-Reset', resetTime.toString());

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

    let userTier = req.user?.tier as SubscriptionTier | undefined;
    if (!userTier) {
        const apiKey = await apiKeysRepository.findById(req.apiKeyId);
        if (!apiKey) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        const userId = apiKey?.userId;
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        userTier = user.tier;
    }

    const maxRequests = userTier === 'free' ? 100 : 1000;
    const windowSeconds = 24 * 60 * 60; // 24 hours

    try {
        const current = await cacheClient.incr(key);
        if (current === 1) {
            await cacheClient.expire(key, windowSeconds);
        }

        const ttl = await cacheClient.ttl(key);
        const resetTime = calculateResetTimeByDayEnd(ttl);

        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader(
            'X-RateLimit-Remaining',
            Math.max(0, maxRequests - current).toString()
        );
        res.setHeader('X-RateLimit-Reset', resetTime.toString());

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
