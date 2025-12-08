import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

import { senses } from "./senses";

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),

  senseId: integer("sense_id")
    .references(() => senses.id, { onDelete: "cascade" })
    .notNull(),

  example: text("example").notNull(),
});
