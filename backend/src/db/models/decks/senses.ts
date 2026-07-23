import { serial, integer, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { headwords } from "./headwords.js";

export const senses = pgTable("senses", {
  id: serial("id").primaryKey(),
  headwordId: integer("headword_id")
    .references(() => headwords.id, { onDelete: "cascade" })
    .notNull(),
  definition: text("definition").notNull(),
});
