import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { InternalServerError } from './error';

const KEY_PREFIX = 'gatescale_';

export async function generateApiKey(): Promise<{
    key: string;
    keyHash: string;
}> {
    const key = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(key, 10);

    const hashWithPrefix = `${KEY_PREFIX}${hash}`;

    return { key, keyHash: hashWithPrefix };
}

export async function compareApiKey(
    key: string,
    keyHash: string
): Promise<boolean> {
    if (keyHash.startsWith(KEY_PREFIX)) {
        throw new InternalServerError('API Key has invalid prefix');
    }

    const hash = keyHash.split('_')[1];

    return await bcrypt.compare(key, hash);
}
