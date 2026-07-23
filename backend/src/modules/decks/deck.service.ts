import { HttpError } from "@/libs/constants/http-error.js";

import { DeckRepository } from "./deck.repository.js";

const DeckService = {
  getDecks() {
    return DeckRepository.findAll();
  },

  async getDeck(deckId: string) {
    const deck = await DeckRepository.findById(deckId);
    if (!deck) {
      throw HttpError.notFound("Deck not found");
    }

    const words = await DeckRepository.findWordsByDeckId(deckId);

    return { ...deck, words };
  },
};

export { DeckService };
