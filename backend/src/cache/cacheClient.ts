import redisClient from './redis.js';

class CacheClient {
    async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        await redisClient.set(key, value, { EX: ttl });
    }

    async incr(key: string): Promise<number> {
        return await redisClient.incr(key);
    }

    async del(key: string): Promise<void> {
        await redisClient.del(key);
    }

    async expire(key: string, seconds: number): Promise<void> {
        await redisClient.expire(key, seconds);
    }
}

const cacheClient = new CacheClient();
export default cacheClient;
