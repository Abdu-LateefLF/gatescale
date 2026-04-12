import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { subscriptionTier, userRole } from './enums.js';

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
    email: varchar('email', { length: 50 }).notNull().unique(),
    passwordHash: text().notNull(),
    role: userRole().notNull().default('user'),
    tier: subscriptionTier().notNull().default('free'),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}).enableRLS();
