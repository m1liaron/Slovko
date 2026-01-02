import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { languages } from "../languages";

export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  languageId: integer("language_id")
    .references(() => languages.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(),
  orderIndex: integer("order_index").notNull(),
});
