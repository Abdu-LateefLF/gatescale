import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import authService from "../../../src/services/auth.service";
import userRepository from "../../../src/repository/UserRepository";
import { comparePasswords, hashPassword } from "../../../src/utils/password";
import { generateToken, verifyToken } from "../../../src/utils/jwt";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repository/UserRepository");
jest.mock("../../../src/utils/password");
jest.mock("../../../src/utils/jwt");

const mockUserRepository = jest.mocked(userRepository);
const mockComparePasswords = jest.mocked(comparePasswords);
const mockHashPassword = jest.mocked(hashPassword);
const mockGenerateToken = jest.mocked(generateToken);
const mockVerifyToken = jest.mocked(verifyToken);

const fakeUser = {
    id: "123",
    name: "John Doe",
    email: "jdoe@gmail.com",
    passwordHash: "ABCD",
    role: "user",
    tier: 'free'
} as const;

beforeEach(() => {
    jest.resetAllMocks();
});

describe('login', () => {
    test('valid credentials log in successfully', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(fakeUser);
        mockComparePasswords.mockResolvedValueOnce(true);
        mockGenerateToken.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

        const tokens = await authService.login(fakeUser.email, 'password');

        expect(tokens).toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        });
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(fakeUser.email);
        expect(mockComparePasswords).toHaveBeenCalledWith('password', fakeUser.passwordHash);
        expect(mockGenerateToken).toHaveBeenNthCalledWith(1, {
            userId: fakeUser.id,
            tier: fakeUser.tier,
            role: fakeUser.role
        }, 900);
        expect(mockGenerateToken).toHaveBeenNthCalledWith(2, { userId: fakeUser.id }, 604800);
    });

    test('rejects invalid email without comparing passwords', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        await expect(authService.login(fakeUser.email, 'password')).rejects.toThrow(BadRequestError);
        expect(mockComparePasswords).not.toHaveBeenCalled();
        expect(mockGenerateToken).not.toHaveBeenCalled();
    });

    test('rejects incorrect password without generating tokens', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(fakeUser);
        mockComparePasswords.mockResolvedValueOnce(false);

        await expect(authService.login(fakeUser.email, 'password')).rejects.toThrow('Invalid email or password');
        expect(mockGenerateToken).not.toHaveBeenCalled();
    });
});

describe('register', () => {
    const payload = {
        name: fakeUser.name,
        email: fakeUser.email,
        password: 'password',
        tier: fakeUser.tier
    };

    test('hashes the password and inserts the user', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);
        mockHashPassword.mockResolvedValueOnce('hashed-password');

        const result = await authService.register(payload);

        expect(result).toEqual({ message: 'Registration successful' });
        expect(mockHashPassword).toHaveBeenCalledWith(payload.password);
        expect(mockUserRepository.insert).toHaveBeenCalledWith({
            name: payload.name,
            email: payload.email,
            tier: payload.tier,
            passwordHash: 'hashed-password'
        });
    });

    test('rejects duplicate email without hashing or inserting', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(fakeUser);

        await expect(authService.register(payload)).rejects.toThrow('Email already in use');
        expect(mockHashPassword).not.toHaveBeenCalled();
        expect(mockUserRepository.insert).not.toHaveBeenCalled();
    });

    test('does not insert when password hashing fails', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);
        mockHashPassword.mockRejectedValueOnce(new Error('Hash failed'));

        await expect(authService.register(payload)).rejects.toThrow('Hash failed');
        expect(mockUserRepository.insert).not.toHaveBeenCalled();
    });
});

describe('refreshToken', () => {
    test('generates an access token with the current role and tier', async () => {
        mockVerifyToken.mockReturnValueOnce({ userId: fakeUser.id });
        mockUserRepository.findById.mockResolvedValueOnce({
            ...fakeUser,
            tier: 'pro',
            role: 'admin'
        });
        mockGenerateToken.mockReturnValueOnce('new-access-token');

        expect(await authService.refreshToken('refresh-token')).toEqual({ accessToken: 'new-access-token' });
        expect(mockVerifyToken).toHaveBeenCalledWith('refresh-token');
        expect(mockUserRepository.findById).toHaveBeenCalledWith(fakeUser.id);
        expect(mockGenerateToken).toHaveBeenCalledWith({
            userId: fakeUser.id,
            tier: 'pro',
            role: 'admin'
        }, 900);
    });

    test('rejects an invalid token without fetching the user', async () => {
        mockVerifyToken.mockImplementationOnce(() => {
            throw new Error('Invalid token');
        });

        await expect(authService.refreshToken('invalid')).rejects.toThrow('Invalid token');
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockGenerateToken).not.toHaveBeenCalled();
    });

    test('rejects a token without a user id', async () => {
        mockVerifyToken.mockReturnValueOnce({});

        await expect(authService.refreshToken('token')).rejects.toThrow(BadRequestError);
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockGenerateToken).not.toHaveBeenCalled();
    });

    test('rejects a deleted user without generating a token', async () => {
        mockVerifyToken.mockReturnValueOnce({ userId: fakeUser.id });
        mockUserRepository.findById.mockResolvedValueOnce(null);

        await expect(authService.refreshToken('token')).rejects.toThrow('User not found');
        expect(mockGenerateToken).not.toHaveBeenCalled();
    });
});
