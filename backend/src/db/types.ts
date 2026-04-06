import { userRole, usersTable } from './schemas/user';

export type User = typeof usersTable.$inferInsert;
export type UserRole = (typeof userRole.enumValues)[number];
