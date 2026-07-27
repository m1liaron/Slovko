import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle.js";
import { users, type User, type NewUser } from "./user.model";

const UserRepository = {
    async create(data: NewUser): Promise<User> {
        const [user] = await db.insert(users).values(data).returning();
        return user;    
    },

    async findById(id: string): Promise<User | undefined> {
        return db.query.users.findFirst({ where: eq(users.id, id) });
    },

    async findByEmail(email: string): Promise<User | undefined> {
        return await db.query.users.findFirst({ where: eq(users.email, email) });
    },

    async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning();
        return user;
    },

    async delete(id: string): Promise<User | undefined> {
        const [user] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning();
        return user;
    },
};

export { UserRepository };