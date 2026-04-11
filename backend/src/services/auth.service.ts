import userRepository from '../repository/UserRepository';
import { BadRequestError } from '../utils/error';
import { comparePasswords, hashPassword } from '../utils/password';
import { RegisterRequest } from '../schemas/auth.schema';
import { generateToken, verifyToken } from '../utils/jwt';
import { UserPayload } from '../middleware/auth';

class AuthService {
    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError('Invalid email or password');
        }

        const isPasswordValid = await comparePasswords(
            password,
            user.passwordHash
        );
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid email or password');
        }

        const accessTokenPayload: UserPayload = {
            userId: user.id || '',
            tier: user.tier || '',
            role: user.role || '',
        };

        const accessToken = generateToken(accessTokenPayload, 15 * 60);
        const refreshToken = generateToken({ userId: user.id }, 7 * 24 * 3600); // Refresh token valid for 7 days

        return { accessToken, refreshToken };
    }

    async refreshToken(token: string): Promise<{ accessToken: string }> {
        const decoded = verifyToken(token);
        const userId = (decoded as any).userId;

        if (!userId) {
            throw new BadRequestError('Invalid token');
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            throw new BadRequestError('User not found');
        }

        const accessToken = generateToken({ userId: user.id, tier: user.tier });

        return {
            accessToken,
        };
    }

    async register(payload: RegisterRequest): Promise<{ message: string }> {
        const userExists = await userRepository.findByEmail(payload.email);
        if (userExists) {
            throw new BadRequestError('Email already in use');
        }

        const { password } = payload;

        const passwordHash = await hashPassword(password);
        await userRepository.insert({ ...payload, passwordHash: passwordHash });

        return { message: 'Registration successful' };
    }
}

const authService = new AuthService();
export default authService;
