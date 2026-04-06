import { z } from 'zod';

const GetUserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    createdAt: z.string(),
    tier: z.enum(['free', 'pro']).optional(),
    role: z.enum(['user', 'admin']).optional(),
});

export type GetUserProfileResponse = z.infer<typeof GetUserProfileSchema>;
export type UserProfile = GetUserProfileResponse;
