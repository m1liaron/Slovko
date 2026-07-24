import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { sections } from "@/modules/section/schema";
import { baseColumns } from "@/db/models";

const groups = pgTable("Groups", {
    title: varchar("title", { length: 30 }).notNull(),
    sectionId: uuid("section_id")
        .notNull()
        .references(() => sections.id),
    ...baseColumns
});

type Group = typeof groups.$inferSelect;
type NewGroup = typeof groups.$inferInsert;

export { groups, type Group, type NewGroup }