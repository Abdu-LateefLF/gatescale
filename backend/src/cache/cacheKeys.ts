class CacheKeys {
    getApiKeyRateLimitKey(apiKeyId: string): string {
        const date = new Date().toISOString().split('T')[0];
        return `rate-limit:${apiKeyId}:api-key:${date}`;
    }

    getUserRateLimitKey(userId: string): string {
        return `rate-limit:${userId}:user`;
    }
}

const cacheKeys = new CacheKeys();
export default cacheKeys;
