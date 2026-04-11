export interface User {
    id: string;
    name: string;
    email: string;
    tier: 'free' | 'pro';
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    expiresAt: string;
}

export type ProtectedApiKey = Omit<ApiKey, 'key'>;
