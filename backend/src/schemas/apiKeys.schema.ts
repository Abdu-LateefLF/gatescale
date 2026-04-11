import { ApiKey } from '../db/types';
import z from 'zod';

export const CreateApiKeySchema = z.object({
    name: z.string().min(1),
});

export type CreateApiKeyInput = z.infer<typeof CreateApiKeySchema>;
export interface CreateApiKeyResult {
    id: string;
    name: string;
    key: string;
    expiresAt: Date;
}

export type ProtectedApiKey = Omit<ApiKey, 'userId' | 'keyHash'>;
