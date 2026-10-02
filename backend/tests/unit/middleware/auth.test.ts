import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { Request, Response } from "express";
import { validate as uuidValidate } from "uuid";
import { authenticate, validateApiKey, validateApiKeyForPlayground } from "../../../src/middleware/auth";
import { verifyToken } from "../../../src/utils/jwt";
import { compareApiKey } from "../../../src/utils/apiKey";
import apiKeysRepository from "../../../src/repository/ApiKeysRepository";

jest.mock("../../../src/utils/jwt");
jest.mock("../../../src/utils/apiKey");
jest.mock("../../../src/repository/ApiKeysRepository");
jest.mock('uuid', () => ({ validate: jest.fn() }));

const mockUuidValidate = jest.mocked(uuidValidate);
const mockVerifyToken = jest.mocked(verifyToken);
const mockCompareApiKey = jest.mocked(compareApiKey);
const mockApiKeysRepository = jest.mocked(apiKeysRepository);

const keyId = '12345678-1234-4123-8123-123456789abc';
const key = `gatescale_${keyId}.secret`;
const fakeKey = {
    id: keyId,
    userId: '123',
    name: 'My key',
    keyHash: 'hash',
    isActive: true,
    expiresAt: new Date('2027-01-01T00:00:00Z')
};
const fakeUser = {
    userId: '123',
    tier: 'free',
    role: 'user'
};

let req: Request;
let res: Response;

const next = jest.fn();
const status = jest.fn<(code: number) => Response>();
const json = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
    mockUuidValidate.mockImplementation((id) => id === keyId);
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
    jest.spyOn(console, 'log').mockImplementation(() => {});

    req = {
        cookies: {},
        headers: {},
        params: {},
    } as Request;
    res = {
        status,
        json
    } as unknown as Response;
    status.mockReturnValue(res);
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

describe('authenticate', () => {
    test('rejects a missing token', () => {
        authenticate()(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockVerifyToken).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        'invalid',
        'expired'
    ])('rejects an %s token', (token) => {
        req.cookies.accessToken = token;
        mockVerifyToken.mockImplementationOnce(() => {
            throw new Error('Invalid token');
        });

        authenticate()(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        {},
        {
            role: 'user',
            tier: 'free'
        },
        {
            userId: '123',
            tier: 'free'
        },
        {
            userId: '123',
            role: 'user'
        }
    ])('rejects incomplete payload %j', (payload) => {
        req.cookies.accessToken = 'token';
        mockVerifyToken.mockReturnValueOnce(payload);

        authenticate()(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('rejects a user without the required role', () => {
        req.cookies.accessToken = 'token';
        mockVerifyToken.mockReturnValueOnce(fakeUser);

        authenticate('admin')(req, res, next);

        expect(status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test.each([undefined, 'admin'] as const)('attaches the payload when role requirement is %s', (role) => {
        req.cookies.accessToken = 'token';
        const payload = {
            ...fakeUser,
            role: 'admin'
        };
        mockVerifyToken.mockReturnValueOnce(payload);

        authenticate(role)(req, res, next);

        expect(mockVerifyToken).toHaveBeenCalledWith('token');
        expect(req.user).toEqual(payload);
        expect(next).toHaveBeenCalledTimes(1);
        expect(status).not.toHaveBeenCalled();
    });
});

describe('validateApiKey', () => {
    test.each([
        undefined,
        ['key'],
        'bad-key',
        'gatescale_not-a-uuid.secret'
    ])('rejects missing or malformed header %j', async (header) => {
        req.headers['x-api-key'] = header;

        await validateApiKey(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockApiKeysRepository.findById).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test('rejects an unknown key', async () => {
        req.headers['x-api-key'] = key;
        mockApiKeysRepository.findById.mockResolvedValueOnce(null);

        await validateApiKey(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockCompareApiKey).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test('rejects the wrong secret', async () => {
        req.headers['x-api-key'] = key;
        mockApiKeysRepository.findById.mockResolvedValueOnce(fakeKey);
        mockCompareApiKey.mockReturnValueOnce(false);

        await validateApiKey(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(req.apiKeyId).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        {
            ...fakeKey,
            isActive: false
        },
        {
            ...fakeKey,
            expiresAt: new Date('2025-12-31T23:59:59Z')
        }
    ])('rejects an inactive or expired key', async (apiKey) => {
        req.headers['x-api-key'] = key;
        mockApiKeysRepository.findById.mockResolvedValueOnce(apiKey);
        mockCompareApiKey.mockReturnValueOnce(true);

        await validateApiKey(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('attaches the id of a valid key', async () => {
        req.headers['x-api-key'] = key;
        mockApiKeysRepository.findById.mockResolvedValueOnce(fakeKey);
        mockCompareApiKey.mockReturnValueOnce(true);

        await validateApiKey(req, res, next);

        expect(mockApiKeysRepository.findById).toHaveBeenCalledWith(keyId);
        expect(mockCompareApiKey).toHaveBeenCalledWith(key, fakeKey.keyHash);
        expect(req.apiKeyId).toBe(keyId);
        expect(next).toHaveBeenCalledTimes(1);
        expect(status).not.toHaveBeenCalled();
    });

    test('returns 500 when the repository fails', async () => {
        req.headers['x-api-key'] = key;
        mockApiKeysRepository.findById.mockRejectedValueOnce(new Error('Database unavailable'));

        await validateApiKey(req, res, next);

        expect(status).toHaveBeenCalledWith(500);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateApiKeyForPlayground', () => {
    test('requires an authenticated user', async () => {
        await validateApiKeyForPlayground(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockApiKeysRepository.findByUserAndId).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        undefined,
        'invalid'
    ])('rejects invalid key id %s', async (id) => {
        req.user = fakeUser;
        if (id) req.params.apiKeyId = id;

        await validateApiKeyForPlayground(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(mockApiKeysRepository.findByUserAndId).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test('rejects another user\'s key through the ownership lookup', async () => {
        req.user = fakeUser;
        req.params.apiKeyId = keyId;
        mockApiKeysRepository.findByUserAndId.mockResolvedValueOnce(null);

        await validateApiKeyForPlayground(req, res, next);

        expect(mockApiKeysRepository.findByUserAndId).toHaveBeenCalledWith(fakeUser.userId, keyId);
        expect(status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        {
            ...fakeKey,
            isActive: false
        },
        {
            ...fakeKey,
            expiresAt: new Date('2025-01-01')
        }
    ])('rejects inactive or expired owned keys', async (apiKey) => {
        req.user = fakeUser;
        req.params.apiKeyId = keyId;
        mockApiKeysRepository.findByUserAndId.mockResolvedValueOnce(apiKey);

        await validateApiKeyForPlayground(req, res, next);

        expect(status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('accepts an active owned key without requiring its secret', async () => {
        req.user = fakeUser;
        req.params.apiKeyId = keyId;
        mockApiKeysRepository.findByUserAndId.mockResolvedValueOnce(fakeKey);

        await validateApiKeyForPlayground(req, res, next);

        expect(req.apiKeyId).toBe(keyId);
        expect(mockCompareApiKey).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('returns 500 when the ownership lookup fails', async () => {
        req.user = fakeUser;
        req.params.apiKeyId = keyId;
        mockApiKeysRepository.findByUserAndId.mockRejectedValueOnce(new Error('Database unavailable'));

        await validateApiKeyForPlayground(req, res, next);

        expect(status).toHaveBeenCalledWith(500);
        expect(next).not.toHaveBeenCalled();
    });
});
