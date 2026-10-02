import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import apiKeysService from "../../../src/services/apiKeys.service";
import apiKeysRepository from "../../../src/repository/ApiKeysRepository";
import { generateApiKey } from "../../../src/utils/apiKey";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repository/ApiKeysRepository");
jest.mock("../../../src/utils/apiKey");

const mockApiKeysRepository = jest.mocked(apiKeysRepository);
const mockGenerateApiKey = jest.mocked(generateApiKey);

const fakeKey = {
    id: 'key-id',
    userId: '123',
    name: 'My key',
    keyHash: 'hash',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    expiresAt: new Date('2027-01-01T00:00:00Z')
};

beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('getApiKeys', () => {
    test('returns an empty list when there are no keys', async () => {
        mockApiKeysRepository.findAllByUserId.mockResolvedValueOnce([]);

        expect(await apiKeysService.getApiKeys('123')).toEqual([]);
        expect(mockApiKeysRepository.findAllByUserId).toHaveBeenCalledWith('123');
    });

    test('returns only active keys and public fields', async () => {
        mockApiKeysRepository.findAllByUserId.mockResolvedValueOnce([fakeKey, {
            ...fakeKey,
            id: 'revoked',
            isActive: false
        }]);

        const keys = await apiKeysService.getApiKeys('123');

        expect(keys).toEqual([{
            id: fakeKey.id,
            name: fakeKey.name,
            createdAt: fakeKey.createdAt,
            expiresAt: fakeKey.expiresAt
        }]);
        expect(keys[0]).not.toHaveProperty('keyHash');
        expect(keys[0]).not.toHaveProperty('userId');
    });
});

describe('createApiKey', () => {
    test('creates the tenth key, stores its hash, and returns its secret', async () => {
        mockApiKeysRepository.findAllByUserId.mockResolvedValueOnce(Array.from({ length: 9 }, () => fakeKey));
        mockGenerateApiKey.mockResolvedValueOnce({
            key: 'plaintext-key',
            keyId: fakeKey.id,
            keyHash: fakeKey.keyHash
        });
        mockApiKeysRepository.createApiKey.mockResolvedValueOnce(fakeKey);

        const result = await apiKeysService.createApiKey('123', 'My key');

        expect(mockApiKeysRepository.createApiKey).toHaveBeenCalledWith({
            id: fakeKey.id,
            userId: '123',
            name: 'My key',
            keyHash: 'hash',
            expiresAt: fakeKey.expiresAt
        });
        expect(result).toEqual({
            id: fakeKey.id,
            name: 'My key',
            key: 'plaintext-key',
            isActive: true,
            expiresAt: fakeKey.expiresAt
        });
        expect(result).not.toHaveProperty('keyHash');
    });

    test.each([
        10,
        11
    ])('rejects creation with %i existing keys', async (count) => {
        mockApiKeysRepository.findAllByUserId.mockResolvedValueOnce(Array.from({ length: count }, () => fakeKey));

        await expect(apiKeysService.createApiKey('123', 'My key')).rejects.toThrow(BadRequestError);
        expect(mockGenerateApiKey).not.toHaveBeenCalled();
        expect(mockApiKeysRepository.createApiKey).not.toHaveBeenCalled();
    });
});

describe('revokeApiKey', () => {
    test('checks ownership and revokes the key', async () => {
        mockApiKeysRepository.findByUserAndId.mockResolvedValueOnce(fakeKey);

        expect(await apiKeysService.revokeApiKey('123', fakeKey.id)).toEqual({ message: 'API key revoked successfully' });
        expect(mockApiKeysRepository.findByUserAndId).toHaveBeenCalledWith('123', fakeKey.id);
        expect(mockApiKeysRepository.revokeApiKey).toHaveBeenCalledWith('123', fakeKey.id);
    });

    test('rejects a missing or unowned key without revoking it', async () => {
        mockApiKeysRepository.findByUserAndId.mockResolvedValueOnce(null);

        await expect(apiKeysService.revokeApiKey('123', 'another-key')).rejects.toThrow('API Key not found');
        expect(mockApiKeysRepository.revokeApiKey).not.toHaveBeenCalled();
    });
});
