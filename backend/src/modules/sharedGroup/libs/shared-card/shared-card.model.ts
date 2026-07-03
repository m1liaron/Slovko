import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { sharedGroups } from "../../index";

const sharedCards = pgTable("SharedCards", {
  ...baseColumns,
  word: varchar("word", { length: 30 }).notNull(),
  translateWord: varchar("translate_word", { length: 100 }).notNull(),
  sharedGroupId: uuid("shared_group_id").references(() => sharedGroups.id),
});

type SharedCard = typeof sharedCards.$inferSelect;
type NewSharedCard = typeof sharedCards.$inferInsert;

export { sharedCards, type SharedCard, type NewSharedCard };