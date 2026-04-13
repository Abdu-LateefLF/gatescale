import 'dotenv/config';
import db from './index.js';
import { usersTable } from './db/schemas/users.js';
import { hashPassword } from './utils/password.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@finql.dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@123!';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Admin';

async function seed() {
    console.log('Seeding database...');

    const passwordHash = await hashPassword(ADMIN_PASSWORD);

    const [admin] = await db
        .insert(usersTable)
        .values({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            passwordHash,
            role: 'admin',
            tier: 'pro',
        })
        .onConflictDoNothing({ target: usersTable.email })
        .returning({ id: usersTable.id, email: usersTable.email });

    if (!admin) {
        console.log(`Admin user already exists (${ADMIN_EMAIL}). Skipping.`);
    } else {
        console.log(`Admin user created: ${admin.email} (id: ${admin.id})`);
    }
    console.log('Seeding complete.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
