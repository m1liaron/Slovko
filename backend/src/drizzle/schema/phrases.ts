import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

import { senses } from "./senses";

export const phrases = pgTable("phrases", {
  id: serial("id").primaryKey(),
  senseId: integer("sense_id")
    .references(() => senses.id, { onDelete: "cascade" })
    .notNull(),
  phrase: text("phrase").notNull(),
  definition: text("definition").notNull(),
});
