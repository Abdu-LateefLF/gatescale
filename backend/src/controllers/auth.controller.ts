import { Request, Response } from 'express';
import {
    LoginInput,
    RefreshTokenInput,
    RegisterInput,
} from '../schemas/auth.schema';
import authService from '../services/auth.service';

class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body as LoginInput;
        const result = await authService.login(email, password);

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/auth/refresh-token',
        });

        res.json({ message: 'Login successful' });
    }

    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body as RefreshTokenInput;
        const { accessToken } = await authService.refreshToken(refreshToken);

        console.log(
            'Refreshed access token: ' +
                accessToken.substring(0, 5).padEnd(12, '*')
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.json({ message: 'Token refresh successful' });
    }

    async register(req: Request, res: Response) {
        const input = req.body as RegisterInput;
        const result = await authService.register(input);
        res.json(result);
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout successful' });
    }
}

const authController = new AuthController();
export default authController;
