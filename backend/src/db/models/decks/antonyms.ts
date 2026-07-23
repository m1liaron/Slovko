import { serial, integer, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { senses } from "./senses.js";

export const antonyms = pgTable("antonyms", {
  id: serial("id").primaryKey(),
  senseId: integer("sense_id")
    .references(() => senses.id, { onDelete: "cascade" })
    .notNull(),
  word: text("word").notNull(),
});
