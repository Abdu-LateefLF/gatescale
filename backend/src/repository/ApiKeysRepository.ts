import { apiKeysTable } from '../db/schemas/apiKeys.js';
import { ApiKey, CreateApiKeyParams } from '../db/types.js';
import db from '../index.js';
import { and, eq } from 'drizzle-orm';
import { InternalServerError } from '../utils/error.js';

class ApiKeysRepository {
    async findAllByUserId(userId: string): Promise<ApiKey[]> {
        const results = await db
            .select()
            .from(apiKeysTable)
            .where(eq(apiKeysTable.userId, userId));

        return results;
    }

    async findById(id: string): Promise<ApiKey | null> {
        const [apiKey] = await db
            .select()
            .from(apiKeysTable)
            .where(eq(apiKeysTable.id, id))
            .limit(1);

        if (!apiKey) {
            return null;
        }

        return apiKey;
    }

    async findByUserAndId(
        userId: string,
        apiKeyId: string
    ): Promise<ApiKey | null> {
        const [apiKey] = await db
            .select()
            .from(apiKeysTable)
            .where(
                and(
                    eq(apiKeysTable.userId, userId),
                    eq(apiKeysTable.id, apiKeyId)
                )
            )
            .limit(1);

        if (!apiKey) {
            return null;
        }

        return apiKey;
    }

    async createApiKey(newApiKey: CreateApiKeyParams): Promise<ApiKey> {
        const [apiKey] = await db
            .insert(apiKeysTable)
            .values(newApiKey)
            .returning();

        if (!apiKey) {
            throw new InternalServerError('Failed to create API key');
        }

        return apiKey;
    }

    async revokeApiKey(userId: string, apiKeyId: string): Promise<void> {
        const [updatedApiKey] = await db
            .update(apiKeysTable)
            .set({ isActive: false })
            .where(
                and(
                    eq(apiKeysTable.id, apiKeyId),
                    eq(apiKeysTable.id, apiKeyId)
                )
            )
            .returning();

        if (!updatedApiKey) {
            throw new InternalServerError('Failed to revoke API key');
        }
    }
}

const apiKeysRepository = new ApiKeysRepository();
export default apiKeysRepository;
