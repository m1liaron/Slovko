import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { baseColumns } from "@/db/models/base.model.js";
import { languages } from "@/modules/language";

const decks = pgTable("decks", {
  ...baseColumns,
  languageId: integer("language_id")
    .references(() => languages.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(),
  orderIndex: integer("order_index").notNull(),
});

export { decks };
