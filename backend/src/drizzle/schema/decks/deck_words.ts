import { integer, pgTable, uuid } from "drizzle-orm/pg-core";

import { headwords } from "../headwords.js";

import { decks } from "./decks.js";

export const deckWords = pgTable("deck_words", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id")
    .references(() => decks.id, { onDelete: "cascade" })
    .notNull(),
  headwordId: integer("headword_id")
    .references(() => headwords.id, { onDelete: "cascade" })
    .notNull(),
  orderIndex: integer("order_index").notNull(),
});
