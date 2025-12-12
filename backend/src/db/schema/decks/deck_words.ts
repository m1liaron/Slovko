import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { headwords } from "../headwords";

import { decks } from "./decks";

export const deckWords = pgTable("deck_words", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id")
    .references(() => decks.id)
    .notNull(),
  headwordId: integer("headword_id")
    .references(() => headwords.id, { onDelete: "cascade" })
    .notNull(),
});
