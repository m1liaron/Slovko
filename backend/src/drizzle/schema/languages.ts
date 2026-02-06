import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
});
