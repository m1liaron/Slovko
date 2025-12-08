import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

import { languages } from "./languages";

export const headwords = pgTable("headwords", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id")
    .references(() => languages.id)
    .notNull(),
  word: text("word").notNull(),
});
