import { StatusCodes } from "http-status-codes";

import type { AuthRequestHandler } from "@/libs/types/auth-request.type.js";

import { DeckService } from "./deck.service";

const getDecks: AuthRequestHandler = async (_req, res) => {
  const decksData = await DeckService.getDecks();
  res.status(StatusCodes.OK).json(decksData);
};

const getDeck: AuthRequestHandler = async (req, res) => {
  const { deckId } = req.params;
  const deck = await DeckService.getDeck(deckId);
  res.status(StatusCodes.OK).json(deck);
};

export { getDecks, getDeck };
