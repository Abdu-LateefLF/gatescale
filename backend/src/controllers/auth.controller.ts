import { CookieOptions, Request, Response } from 'express';
import { LoginRequest, RegisterRequest } from '../schemas/auth.schema.js';
import authService from '../services/auth.service.js';
import { BadRequestError } from '../utils/error.js';

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? 'lax' : 'none',
};

class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body as LoginRequest;
        const result = await authService.login(email, password);

        res.cookie('accessToken', result.accessToken, {
            ...baseCookieOptions,
            path: '/',
        });
        res.cookie('refreshToken', result.refreshToken, {
            ...baseCookieOptions,
            path: '/',
        });

        res.json({ message: 'Login successful' });
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new BadRequestError('Refresh token missing');
        }

        try {
            const { accessToken } =
                await authService.refreshToken(refreshToken);

            res.cookie('accessToken', accessToken, {
                ...baseCookieOptions,
                path: '/',
            });

            res.json({ message: 'Token refresh successful' });
        } catch (error) {
            res.clearCookie('accessToken', {
                path: '/',
            });
            res.clearCookie('refreshToken', {
                path: '/',
            });
            throw error;
        }
    }

    async register(req: Request, res: Response) {
        const input = req.body as RegisterRequest;
        const result = await authService.register(input);
        res.json(result);
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('accessToken', {
            path: '/',
        });
        res.clearCookie('refreshToken', {
            path: '/',
        });
        res.json({ message: 'Logout successful' });
    }
}

const authController = new AuthController();
export default authController;
