import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "@/modules/user/schema";
import { languages } from "@/modules/language/schema";
import { baseColumns } from "@/db/models";

export const sections = pgTable("Sections", {
    title: varchar("title", { length: 255 }).notNull(),
    languageId: uuid("language_id").references(() => languages.id),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    ...baseColumns
});

export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;