import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

import { senses } from "./senses";

export const idioms = pgTable("idioms", {
  id: serial("id").primaryKey(),
  senseId: integer("sense_id")
    .references(() => senses.id, { onDelete: "cascade" })
    .notNull(),
  idiom: text("idiom").notNull(),
  definition: text("definition").notNull(),
});
