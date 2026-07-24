import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const languages = pgTable("Languages", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    code: varchar("code", { length: 10 }).notNull(),
    symbol: varchar("symbol", { length: 10 }).notNull()
})

type Language = typeof languages.$inferSelect;
type NewLanguage = typeof languages.$inferInsert;

export {
    languages,
    type Language,
    type NewLanguage
};
