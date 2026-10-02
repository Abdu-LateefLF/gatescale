import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { Request, Response } from "express";
import { userRateLimiter, apiKeyRateLimiter } from "../../../src/middleware/rateLimiter";
import cacheClient from "../../../src/cache/cacheClient";
import apiKeysRepository from "../../../src/repository/ApiKeysRepository";
import userRepository from "../../../src/repository/UserRepository";

jest.mock("../../../src/cache/cacheClient", () => ({
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn()
}));
jest.mock("../../../src/repository/ApiKeysRepository");
jest.mock("../../../src/repository/UserRepository");

const mockCacheClient = jest.mocked(cacheClient);
const mockApiKeysRepository = jest.mocked(apiKeysRepository);
const mockUserRepository = jest.mocked(userRepository);

const now = new Date('2026-01-01T12:00:00Z');
const fakeKey = {
    id: 'key-id',
    userId: '123',
    name: 'My key',
    keyHash: 'hash',
    expiresAt: new Date('2027-01-01')
};
const fakeUser = {
    id: '123',
    name: 'John Doe',
    email: 'jdoe@gmail.com',
    passwordHash: 'hash',
    tier: 'free'
} as const;
let req: Request;
let res: Response;

const next = jest.fn();
const status = jest.fn<(code: number) => Response>();
const json = jest.fn();
const setHeader = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(now);

    req = { ip: '127.0.0.1' } as Request;
    res = {
        status,
        json,
        setHeader
    } as unknown as Response;
    status.mockReturnValue(res);
    mockCacheClient.ttl.mockResolvedValue(60);
});

afterEach(() => {
    jest.useRealTimers();
});

describe('userRateLimiter', () => {
    test('sets expiry only on the first request and returns headers', async () => {
        mockCacheClient.incr.mockResolvedValueOnce(1).mockResolvedValueOnce(2);
        const limiter = userRateLimiter(3, 60);

        await limiter(req, res, next);
        await limiter(req, res, next);

        expect(mockCacheClient.incr).toHaveBeenCalledWith('rate-limit:127.0.0.1:user');
        expect(mockCacheClient.expire).toHaveBeenCalledTimes(1);
        expect(mockCacheClient.expire).toHaveBeenCalledWith('rate-limit:127.0.0.1:user', 60);
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '3');
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '1');
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', (now.getTime() / 1000 + 60).toString());
        expect(next).toHaveBeenCalledTimes(2);
    });

    test.each([
        [3, true],
        [4, false]
    ])('handles request %i at a limit of 3', async (count, allowed) => {
        mockCacheClient.incr.mockResolvedValueOnce(count);

        await userRateLimiter(3, 60)(req, res, next);

        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
        expect(next).toHaveBeenCalledTimes(allowed ? 1 : 0);
        if (!allowed) expect(status).toHaveBeenCalledWith(429);
    });

    test('rejects a missing ip without incrementing the counter', async () => {
        req = {} as Request;
        await userRateLimiter(3, 60)(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockCacheClient.incr).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test.each(['incr', 'expire', 'ttl'] as const)('returns 500 if cache %s fails', async (method) => {
        mockCacheClient.incr.mockResolvedValue(1);
        mockCacheClient[method].mockRejectedValueOnce(new Error('Redis unavailable'));

        await userRateLimiter(3, 60)(req, res, next);

        expect(status).toHaveBeenCalledWith(500);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('apiKeyRateLimiter', () => {
    test.each([['free', 100], ['pro', 1000]] as const)('applies the %s tier limit of %i', async (tier, limit) => {
        req.apiKeyId = fakeKey.id;
        req.user = {
            userId: '123',
            role: 'user',
            tier
        };
        mockCacheClient.incr.mockResolvedValueOnce(limit).mockResolvedValueOnce(limit + 1);

        await apiKeyRateLimiter(req, res, next);
        await apiKeyRateLimiter(req, res, next);

        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', limit.toString());
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
        expect(next).toHaveBeenCalledTimes(1);
        expect(status).toHaveBeenCalledWith(429);
        expect(mockApiKeysRepository.findById).not.toHaveBeenCalled();
    });

    test('looks up the owner tier and sets a daily counter expiry', async () => {
        req.apiKeyId = fakeKey.id;
        mockApiKeysRepository.findById.mockResolvedValueOnce(fakeKey);
        mockUserRepository.findById.mockResolvedValueOnce({
            ...fakeUser,
            tier: 'pro'
        });
        mockCacheClient.incr.mockResolvedValueOnce(1);
        mockCacheClient.ttl.mockResolvedValueOnce(86400);

        await apiKeyRateLimiter(req, res, next);

        expect(mockApiKeysRepository.findById).toHaveBeenCalledWith(fakeKey.id);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(fakeKey.userId);
        expect(mockCacheClient.expire).toHaveBeenCalledWith('rate-limit:key-id:api-key:2026-01-01', 86400);
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '1000');
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '999');
        expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', (new Date('2026-01-02T00:00:00Z').getTime() / 1000).toString());
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('does not reset expiry for a later request', async () => {
        req.apiKeyId = fakeKey.id;
        req.user = {
            userId: '123',
            role: 'user',
            tier: 'free'
        };
        mockCacheClient.incr.mockResolvedValueOnce(2);

        await apiKeyRateLimiter(req, res, next);

        expect(mockCacheClient.expire).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('rejects a missing key id', async () => {
        await apiKeyRateLimiter(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockCacheClient.incr).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        'key',
        'owner'
    ])('rejects a missing %s', async (missing) => {
        req.apiKeyId = fakeKey.id;
        mockApiKeysRepository.findById.mockResolvedValueOnce(missing === 'key' ? null : fakeKey);
        mockUserRepository.findById.mockResolvedValueOnce(null);

        await apiKeyRateLimiter(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockCacheClient.incr).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test.each(['incr', 'expire', 'ttl'] as const)('returns 500 if cache %s fails', async (method) => {
        req.apiKeyId = fakeKey.id;
        req.user = {
            userId: '123',
            role: 'user',
            tier: 'free'
        };
        mockCacheClient.incr.mockResolvedValue(1);
        mockCacheClient[method].mockRejectedValueOnce(new Error('Redis unavailable'));

        await apiKeyRateLimiter(req, res, next);

        expect(status).toHaveBeenCalledWith(500);
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        'key',
        'owner'
    ])('returns 500 if the %s lookup fails', async (lookup) => {
        req.apiKeyId = fakeKey.id;
        mockApiKeysRepository.findById.mockResolvedValueOnce(fakeKey);
        if (lookup === 'key') {
            mockApiKeysRepository.findById.mockReset().mockRejectedValueOnce(new Error('Database unavailable'));
        } else {
            mockUserRepository.findById.mockRejectedValueOnce(new Error('Database unavailable'));
        }
        await apiKeyRateLimiter(req, res, next);

        expect(status).toHaveBeenCalledWith(500);
        expect(mockCacheClient.incr).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});
