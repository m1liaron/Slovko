import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { users } from "../index";

const results = pgTable("Results", {
    ...baseColumns,
    title: varchar("title", { length: 255 }).notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    startedLearn: timestamp("started_learn", { withTimezone: true }).notNull(),
    completionTime: timestamp("completion_time", { withTimezone: true }).notNull(),
});

type Result = typeof results.$inferSelect;
type NewResult = typeof results.$inferInsert;

export { results, type Result, type NewResult };