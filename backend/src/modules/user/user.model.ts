import { pgTable, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { baseColumns } from "@/db/models";

export const users = pgTable("Users", {
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    image: text("image"),
    streak: integer("streak").notNull().default(0),
    lastReviewAt: timestamp("last_review_at", { withTimezone: true })
        .notNull()
        .default(sql`now()`),
    points: integer("points").notNull().default(0),
    frozen: boolean("frozen").notNull().default(false),
    ...baseColumns
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;