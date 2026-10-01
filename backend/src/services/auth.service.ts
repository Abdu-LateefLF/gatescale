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

        const accessToken = this.generateAccessToken(
            user.id!,
            user.tier!,
            user.role!
        );
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

        const accessToken = this.generateAccessToken(
            user.id!,
            user.tier!,
            user.role!
        );

        return {
            accessToken,
        };
    }

    async register(payload: RegisterRequest): Promise<{ message: string }> {
        const userExists = await userRepository.findByEmail(payload.email);
        if (userExists) {
            throw new BadRequestError('Email already in use');
        }

        const { name, email, password, tier } = payload;

        const passwordHash = await hashPassword(password);
        await userRepository.insert({
            name,
            email,
            tier,
            passwordHash: passwordHash,
        });

        return { message: 'Registration successful' };
    }

    private generateAccessToken(userId: string, tier: string, role: string) {
        const accessTokenPayload: UserPayload = {
            userId,
            tier,
            role,
        };

        return generateToken(accessTokenPayload, 15 * 60);
    }
}

const authService = new AuthService();
export default authService;
