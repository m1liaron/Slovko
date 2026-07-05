import { db } from "@/db/drizzle";
import { and, between, eq } from "drizzle-orm";
import { streaks } from "./streak.model";


type StreakRecord = typeof streaks.$inferSelect;
type StreakInsert = typeof streaks.$inferInsert;

const StreakRepository = {
    async findOneByUserAndDate(
        userId: string,
        date: Date,
    ): Promise<StreakRecord | undefined> {
        const [streak] = await db
            .select()
            .from(streaks)
            .where(and(eq(streaks.userId, userId), eq(streaks.date, date)));
        return streak;
    },

    async create(data: StreakInsert): Promise<StreakRecord> {
        const [streak] = await db.insert(streaks).values(data).returning();
        return streak;
    },

    async findAllByUserAndDateRange(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<StreakRecord[]> {
        return db
            .select()
            .from(streaks)
            .where(
                and(eq(streaks.userId, userId), between(streaks.date, startDate, endDate)),
            );
    },

    async findAllByUserWithSelectedFields(userId: string) {
        return db
            .select({
                id: streaks.id,
                date: streaks.date,
                createdAt: streaks.createdAt,
                updatedAt: streaks.updatedAt,
            })
            .from(streaks)
            .where(eq(streaks.userId, userId));
    },
};

export { StreakRepository }