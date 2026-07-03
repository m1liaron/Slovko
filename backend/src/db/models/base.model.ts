import { uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const baseColumns = {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
};

export { baseColumns }