import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schemas/user';
import db from '../index';

class UserRepository {
    async insert(name: string, email: string, passwordHash: string) {
        const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();
        if (!user) {
            throw new Error("Failed to create user");
        }

        return user;
    }

    async findByEmail(email: string) {
        const [user]= await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        if (!user) {
            return null;
        }

        return user;
    }
}

const userRepository = new UserRepository();
export default userRepository;