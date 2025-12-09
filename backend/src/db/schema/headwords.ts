import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { languages } from "./languages";
import { partOfSpeechEnum } from "./part_of_speech";

export const headwords = pgTable("headwords", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id")
    .references(() => languages.id)
    .notNull(),
  word: text("word").notNull(),
  pos: partOfSpeechEnum("pos").notNull(),
  level: text("level").notNull()
});
