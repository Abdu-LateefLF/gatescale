interface UserPayload {
    userId: string;
    tier: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
            apiKeyId?: string;
        }
    }
}
export {};
