import z from 'zod';

export const loginRequestSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6),
});

export const registerRequestSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
    tier: z.enum(['free', 'pro'], { message: 'Invalid tier' }),
});

export const refreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
