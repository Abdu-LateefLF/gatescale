export interface UserProfile {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    tier?: 'free' | 'pro';
    role?: 'user' | 'admin';
}
