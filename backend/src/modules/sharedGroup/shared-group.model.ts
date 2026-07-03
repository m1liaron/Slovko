import { pgTable, uuid, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { users } from "../index";

const sharedGroups = pgTable("SharedGroups", {
    ...baseColumns,
    title: varchar("title", { length: 30 }).notNull().unique(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    wordsLength: integer("words_length").notNull(),
});

type SharedGroup = typeof sharedGroups.$inferSelect;
type NewSharedGroup = typeof sharedGroups.$inferInsert;

export { sharedGroups, type SharedGroup, type NewSharedGroup };