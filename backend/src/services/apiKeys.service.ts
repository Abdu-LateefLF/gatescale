import apiKeysRepository from '../repository/ApiKeysRepository.js';
import { CreateApiKeyResult, ProtectedApiKey } from '../schemas/apiKeys.schema.js';
import { generateApiKey } from '../utils/apiKey.js';
import { BadRequestError } from '../utils/error.js';

class ApiKeysService {
    readonly MAX_API_KEYS = 10;

    async getApiKeys(userId: string): Promise<ProtectedApiKey[]> {
        const apiKeys = await apiKeysRepository.findAllByUserId(userId);
        if (!apiKeys || apiKeys.length === 0) {
            return [];
        }

        const results = apiKeys
            .filter((apiKey) => apiKey.isActive)
            .map((apiKey) => ({
                id: apiKey.id,
                name: apiKey.name,
                createdAt: apiKey.createdAt,
                expiresAt: apiKey.expiresAt,
            }));

        return results;
    }

    async createApiKey(
        userId: string,
        name: string
    ): Promise<CreateApiKeyResult> {
        const allKeys = await apiKeysRepository.findAllByUserId(userId);
        if (allKeys.length >= this.MAX_API_KEYS) {
            throw new BadRequestError('Maximum number of API keys reached');
        }

        const { key, keyId, keyHash } = await generateApiKey();

        const newKey = await apiKeysRepository.createApiKey({
            id: keyId,
            name,
            userId,
            keyHash,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        });

        const result = {
            id: newKey.id!,
            name: newKey.name,
            key: key,
            isActive: newKey.isActive!,
            expiresAt: newKey.expiresAt,
        };

        return result;
    }

    async revokeApiKey(
        userId: string,
        id: string
    ): Promise<{ message: string }> {
        const apiKey = await apiKeysRepository.findByUserAndId(userId, id);
        if (!apiKey) {
            throw new BadRequestError('API Key not found');
        }

        await apiKeysRepository.revokeApiKey(userId, id);

        return { message: 'API key revoked successfully' };
    }
}

const apiKeysService = new ApiKeysService();
export default apiKeysService;
