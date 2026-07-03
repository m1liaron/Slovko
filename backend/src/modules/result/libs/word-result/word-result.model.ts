import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { resultModes } from "../result-mode/result-mode.model";

const wordResults = pgTable("WordsResult", {
    ...baseColumns,
    resultModeId: uuid("result_mode_id").references(() => resultModes.id),
    word: varchar("word", { length: 255 }).notNull(),
    translate: varchar("translate", { length: 255 }).notNull(),
    mistakesAmount: integer("mistakes_amount").notNull().default(0),
});

type WordResult = typeof wordResults.$inferSelect;
type NewWordResult = typeof wordResults.$inferInsert;

export { wordResults, type WordResult, type NewWordResult };