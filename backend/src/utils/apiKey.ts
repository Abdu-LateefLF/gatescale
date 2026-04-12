import crypto from 'crypto';

const KEY_PREFIX = 'gatescale';

export async function generateApiKey(): Promise<{
    key: string;
    keyHash: string;
    keyId: string;
}> {
    const secret = crypto.randomBytes(32).toString('hex');
    const keyId = crypto.randomUUID();

    const keyWithPrefix = `${KEY_PREFIX}_${keyId}.${secret}`;
    const keyHash = hashApiKey(secret);

    return { key: keyWithPrefix, keyId, keyHash };
}

function hashApiKey(secret: string): string {
    const hmacSecret = process.env.API_KEY_HMAC_SECRET;
    if (!hmacSecret) throw new Error('API_KEY_HMAC_SECRET is not set');
    return crypto.createHmac('sha256', hmacSecret).update(secret).digest('hex');
}

export function compareApiKey(key: string, keyHash: string): boolean {
    const secret = key.split('.')[1];
    if (!secret) return false;

    const candidateHash = hashApiKey(secret);
    return crypto.timingSafeEqual(
        Buffer.from(candidateHash, 'hex'),
        Buffer.from(keyHash, 'hex')
    );
}
