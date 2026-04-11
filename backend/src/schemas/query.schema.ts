import z from 'zod';

export const runQueryRequestSchema = z.object({
    query: z.string().min(1, 'query is required'),
});

export type RunQueryRequest = z.infer<typeof runQueryRequestSchema>;
