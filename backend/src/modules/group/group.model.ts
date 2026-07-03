import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { sections } from "../index";
import { baseColumns } from "@/db/models";

export const groups = pgTable("Groups", {
    title: varchar("title", { length: 30 }).notNull(),
    sectionId: uuid("section_id")
        .notNull()
        .references(() => sections.id),
    ...baseColumns
});

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;