import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { subscriptionTier, userRole } from './enums';

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    role: userRole().notNull().default('user'),
    tier: subscriptionTier().notNull().default('free'),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
