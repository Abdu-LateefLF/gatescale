import { subscriptionTier, userRole } from './schemas/enums.ts';
import { usersTable } from './schemas/users.ts';
import { apiKeysTable } from './schemas/apiKeys.ts';
import { apiRequestLogsTable } from './schemas/apiRequestLogs.ts';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = typeof usersTable.$inferInsert;
export type UserRole = (typeof userRole.enumValues)[number];
export type SubscriptionTier = (typeof subscriptionTier.enumValues)[number];

export type ApiKey = typeof apiKeysTable.$inferInsert;
export type CreateApiKeyParams = Omit<
    PartialBy<ApiKey, 'id'>,
    'createdAt' | 'isActive'
>;

export type ApiRequestLog = typeof apiRequestLogsTable.$inferInsert;
export type CreateApiRequestLogParams = Omit<
    PartialBy<ApiRequestLog, 'id'>,
    'createdAt'
>;
