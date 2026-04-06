import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    role: userRole().notNull().default('user'),
    tier: subscriptionTier().notNull().default('free'),
    createdAt: text().notNull().default(new Date().toISOString()),
});