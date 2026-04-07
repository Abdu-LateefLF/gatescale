export interface User {
    id: string;
    name: string;
    email: string;
    tier: 'free' | 'pro';
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}
