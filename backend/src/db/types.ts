import { subscriptionTier, userRole } from './schemas/enums.js';
import { usersTable } from './schemas/users.js';
import { apiKeysTable } from './schemas/apiKeys.js';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = typeof usersTable.$inferInsert;
export type UserRole = (typeof userRole.enumValues)[number];
export type SubscriptionTier = (typeof subscriptionTier.enumValues)[number];

export type ApiKey = typeof apiKeysTable.$inferInsert;
export type CreateApiKeyParams = Omit<
    PartialBy<ApiKey, 'id'>,
    'createdAt' | 'isActive'
>;
