import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const apiKeysTable = pgTable('api_keys', {
    id: uuid().primaryKey().defaultRandom().notNull(),
    name: text().notNull(),
    keyHash: text().notNull().unique(),
    isActive: boolean().notNull().default(true),
    userId: uuid().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
}).enableRLS();
