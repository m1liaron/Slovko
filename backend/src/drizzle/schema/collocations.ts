import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

import { senses } from "./senses.js";

export const collocations = pgTable("collocations", {
  id: serial("id").primaryKey(),

  senseId: integer("sense_id")
    .references(() => senses.id, { onDelete: "cascade" })
    .notNull(),

  collocation: text("collocation").notNull(),
});
