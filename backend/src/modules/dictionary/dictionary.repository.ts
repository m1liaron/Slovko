import { eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle.js";
import { senses } from "@/db/models/decks/senses";

const DictionaryRepository = {
    async findHeadwordByWord(word: string) {
        const result = await db.execute<{
            id: number;
            language_id: number;
            word: string;
            pos: string;
            level: string;
        }>(sql`
            SELECT id, language_id, word, pos, level
            FROM headwords
            WHERE word = ${word.toLowerCase()}
        `);
        return result.rows[0];
    },

    async findFirstSenseByHeadwordId(headwordId: number) {
        const [sense] = await db
            .select()
            .from(senses)
            .where(eq(senses.headwordId, headwordId))
            .orderBy(senses.id);
        return sense;
    },
};

export { DictionaryRepository };