import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/error.js';
import { UserRole } from '../db/types.js';
import apiKeysRepository from '../repository/ApiKeysRepository.js';
import { validate as uuidValidate } from 'uuid';
import { compareApiKey } from '../utils/apiKey.js';

export type UserPayload = {
    userId: string;
    tier: string;
    role: string;
};

export function authenticate(role?: UserRole) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = verifyToken(token) as UserPayload;

            if (!decoded || !decoded.userId || !decoded.role || !decoded.tier) {
                throw new AuthenticationError('Invalid token payload');
            }

            if (role && decoded.role !== role) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
}

export async function validateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key = req.headers['x-api-key'];
    if (!key || typeof key !== 'string') {
        return res.status(401).json({ error: 'Missing API key' });
    }

    const keyId = key.split('.')[0].split('_')[1];
    if (!keyId || !uuidValidate(keyId)) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    try {
        const apiKey = await apiKeysRepository.findById(keyId);
        if (!apiKey) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        const isKeyValid = compareApiKey(key, apiKey.keyHash);
        if (!isKeyValid) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        if (!apiKey.isActive || apiKey.expiresAt < new Date()) {
            return res
                .status(401)
                .json({ error: 'API key is inactive or has expired' });
        }

        req.apiKeyId = keyId;
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    next();
}

export async function validateApiKeyForPlayground(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKeyId = req.params.apiKeyId;
    if (!apiKeyId || typeof apiKeyId !== 'string' || !uuidValidate(apiKeyId)) {
        return res.status(401).json({ error: 'Invalid API key ID' });
    }

    try {
        const apiKey = await apiKeysRepository.findByUserAndId(
            req.user.userId,
            apiKeyId
        );
        if (!apiKey) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        if (!apiKey.isActive || apiKey.expiresAt < new Date()) {
            return res
                .status(401)
                .json({ error: 'API key is inactive or has expired' });
        }

        req.apiKeyId = apiKeyId;
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    next();
}
