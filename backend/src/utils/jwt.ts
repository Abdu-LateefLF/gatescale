import jwt from 'jsonwebtoken';
import { AuthenticationError, InternalServerError } from './error.js';

const SECRET_KEY = process.env.JWT_SECRET;
const ALGORITHM = 'HS256';

export function generateToken(
    payload: object,
    expiresIn: number = 3600
): string {
    if (!SECRET_KEY) {
        throw new InternalServerError(
            'JWT_SECRET is not defined in environment variables'
        );
    }

    return jwt.sign(payload, SECRET_KEY, { expiresIn, algorithm: ALGORITHM });
}

export function verifyToken(token: string): object {
    if (!SECRET_KEY) {
        throw new InternalServerError(
            'JWT_SECRET is not defined in environment variables'
        );
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY, {
            algorithms: [ALGORITHM],
        });
        if (typeof decoded !== 'object') {
            throw new AuthenticationError('Invalid token');
        }
        return decoded;
    } catch (err) {
        throw new AuthenticationError('Invalid token');
    }
}
