import { userRole, usersTable } from './schemas/users';

export type User = typeof usersTable.$inferInsert;
export type UserRole = (typeof userRole.enumValues)[number];
