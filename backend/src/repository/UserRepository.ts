import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schemas/user';
import db from '../index';
import { User } from '../db/types';

type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

class UserRepository {
    async insert(newUser: CreateUserInput): Promise<User> {
        const [user] = await db.insert(usersTable).values(newUser).returning();
        if (!user) {
            throw new Error("Failed to create user");
        }

        return user;
    }

    async findById(id: string) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
        if (!user) {
            return null;
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