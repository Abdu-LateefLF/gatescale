import { ApiKey } from '../db/types';
import z from 'zod';

export const createApiKeyRequestSchema = z.object({
    name: z.string().min(1),
});

export type CreateApiKeyRequest = z.infer<typeof createApiKeyRequestSchema>;
export interface CreateApiKeyResult {
    id: string;
    name: string;
    key: string;
    expiresAt: Date;
}

export type ProtectedApiKey = Omit<ApiKey, 'userId' | 'keyHash'>;
