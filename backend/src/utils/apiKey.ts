import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { BadRequestError, InternalServerError } from './error';

const KEY_PREFIX = 'gatescale';

export async function generateApiKey(): Promise<{
    key: string;
    keyHash: string;
}> {
    const key = crypto.randomBytes(32).toString('hex');
    const uuid = crypto.randomUUID();

    const keyWithPrefix = `${KEY_PREFIX}_${uuid}.${key}`;
    const keyHash = await bcrypt.hash(keyWithPrefix, 10);

    return { key, keyHash };
}

export async function compareApiKey(
    key: string,
    keyHash: string
): Promise<boolean> {
    return await bcrypt.compare(key, keyHash);
}
