import { usersTable } from "./schemas/user";

export type User = typeof usersTable.$inferInsert;