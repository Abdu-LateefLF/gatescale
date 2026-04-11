import { pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['user', 'admin']);
export const subscriptionTier = pgEnum('subscription_tier', ['free', 'pro']);
