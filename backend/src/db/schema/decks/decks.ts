import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { languages } from "../languages";

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id")
    .references(() => languages.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(),
});
