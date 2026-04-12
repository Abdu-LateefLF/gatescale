class CacheKeys {
    getApiKeyRateLimitKey(apiKeyId: string): string {
        return `rate-limit:${apiKeyId}:api-key`;
    }

    getUserRateLimitKey(userId: string): string {
        return `rate-limit:${userId}:user`;
    }
}

const cacheKeys = new CacheKeys();
export default cacheKeys;
