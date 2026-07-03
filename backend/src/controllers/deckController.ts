import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import { db } from "../drizzle/index.js";
import { decks, deckWords, headwords } from "../drizzle/schema/tables.js";
import { AuthRequestHandler } from "@/libs/types/auth-request.type.js";

const getDecks: AuthRequestHandler = async (req, res) => {
  const decksData = await db.select().from(decks).orderBy(decks.orderIndex);

  res.status(StatusCodes.OK).json(decksData);
};

const getDeck: AuthRequestHandler = async (req, res) => {
  const { deckId } = req.params;

  const deck = await db.select().from(decks).where(eq(decks.id, deckId));

  const words = await db
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

  res.status(StatusCodes.OK).json({
    ...deck,
    words,
  });
};

export { getDecks, getDeck };
