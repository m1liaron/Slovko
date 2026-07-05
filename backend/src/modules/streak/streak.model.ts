import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { users } from "@/modules/index";

const streaks = pgTable("Streaks", {
	...baseColumns,
	date: timestamp("date", { withTimezone: true }).notNull(),
	frozen: boolean("frozen").notNull().default(false),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
});

type Streak = typeof streaks.$inferSelect;
type NewStreak = typeof streaks.$inferInsert;

export { streaks, type Streak, type NewStreak };