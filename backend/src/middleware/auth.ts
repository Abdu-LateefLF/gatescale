import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError } from '../utils/error';
import { UserRole } from '../db/types';
import apiKeysRepository from '../repository/ApiKeysRepository';
import { validate as uuidValidate } from 'uuid';

export type UserPayload = {
    userId: string;
    tier: string;
    role: string;
};

export function authenticate(role?: UserRole) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = verifyToken(token) as UserPayload;

            if (!decoded || !decoded.userId || !decoded.role || !decoded.tier) {
                throw new AuthenticationError('Invalid token payload');
            }

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
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
        return res.status(401).json({ message: 'Missing API key' });
    }

    const keyId = key.split('.')[0].split('_')[1];
    if (!keyId || !uuidValidate(keyId)) {
        return res.status(401).json({ message: 'Invalid API key' });
    }

    try {
        const apiKey = await apiKeysRepository.findById(keyId);
        if (!apiKey) {
            return res.status(401).json({ message: 'Invalid API key' });
        }

        if (!apiKey.isActive || apiKey.expiresAt < new Date()) {
            return res
                .status(401)
                .json({ message: 'API key is inactive or has expired' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    next();
}
