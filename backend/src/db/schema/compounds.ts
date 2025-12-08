import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

import { headwords } from "./headwords";

export const compounds = pgTable("compounds", {
  id: serial("id").primaryKey(),
  headwordId: integer("headword_id")
    .references(() => headwords.id, { onDelete: "cascade" })
    .notNull(),
  compound: text("compound").notNull(),
});
