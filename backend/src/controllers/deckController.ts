import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import type { AuthRequestHandler } from "../common/types/AuthRequest.type";
import { db } from "../db";
import { decks, deckWords, headwords } from "../db/schema/tables";
import { sendError } from "../helpers";

const getDecks: AuthRequestHandler = async (req, res) => {
  try {
    const decksData = await db.select().from(decks).orderBy(decks.orderIndex);

    res.status(StatusCodes.OK).json(decksData);
  } catch (error) {
    sendError(res, error);
  }
};

const getDeck: AuthRequestHandler = async (req, res) => {
  const { deckId } = req.params;

  try {
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
  } catch (error) {
    sendError(res, error);
  }
};

export { getDecks, getDeck };
