import crypto from 'crypto';
import bcrypt from 'bcrypt';

const KEY_PREFIX = 'gatescale';

export async function generateApiKey(): Promise<{
    key: string;
    keyHash: string;
    keyId: string;
}> {
    const key = crypto.randomBytes(32).toString('hex');
    const keyId = crypto.randomUUID();

    const keyWithPrefix = `${KEY_PREFIX}_${keyId}.${key}`;
    const keyHash = await bcrypt.hash(keyWithPrefix, 10);

    return { key: keyWithPrefix, keyId, keyHash };
}

export async function compareApiKey(
    key: string,
    keyHash: string
): Promise<boolean> {
    return await bcrypt.compare(key, keyHash);
}
