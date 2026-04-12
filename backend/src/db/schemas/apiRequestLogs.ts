import { pgTable, uuid, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const apiRequestLogsTable = pgTable('api_request_logs', {
    id: uuid().primaryKey().defaultRandom().notNull(),
    apiKeyId: uuid('api_key_id').notNull(),
    statusCode: integer('status_code').notNull(),
    durationMs: integer('duration_ms').notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    path: text('path'),
}).enableRLS();
