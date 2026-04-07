import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError } from '../utils/error';
import { UserRole } from '../db/types';

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
            console.log('Decoded token:', decoded);

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
