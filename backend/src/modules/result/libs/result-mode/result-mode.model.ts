import { pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { results } from "../../schema";

const resultModeEnum = pgEnum("result_mode", [
    "flashCards",
    "quiz",
    "guessWord",
    "checkTranslate",
]);

const resultModes = pgTable("ResultsMode", {
    ...baseColumns,
    mode: resultModeEnum("mode").notNull(),
    resultId: uuid("result_id").references(() => results.id),
});

type ResultMode = typeof resultModes.$inferSelect;
type NewResultMode = typeof resultModes.$inferInsert;

export { resultModes, resultModeEnum, type ResultMode, type NewResultMode };