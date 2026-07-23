import { eq } from "drizzle-orm";

import { db } from "@/db";
import { decks, deckWords, headwords } from "@/db/models/decks/tables";

const DeckRepository = {
  async findAll() {
    return await db.select().from(decks).orderBy(decks.orderIndex);
  },

  findById(deckId: string) {
    return db.query.decks.findFirst({
      where: eq(decks.id, deckId),
    });
  },

  findWordsByDeckId(deckId: string) {
    return db
      .select({
        id: headwords.id,
        word: headwords.word,
        pos: headwords.pos,
        level: headwords.level,
      })
      .from(deckWords)
      .innerJoin(headwords, eq(deckWords.headwordId, headwords.id))
      .where(eq(deckWords.deckId, deckId))
      .orderBy(deckWords.orderIndex);
  },
};

export { DeckRepository };
