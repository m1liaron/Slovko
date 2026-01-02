import fs from "fs";
import path from "path";

import { v4 as uuidv4 } from "uuid";

interface Deck {
  title: string;
  description?: string;
  wordIds: number[]; // integer IDs from headerwords table
}

const seedsDir = "./src/db/seeds";
if (!fs.existsSync(seedsDir)) fs.mkdirSync(seedsDir, { recursive: true });

/**
 * Generate SQL seeds for decks and deck_words
 * @param decks Array of Deck objects
 */
function generateDeckSeeds(decks: Deck[]) {
  const decksRows: string[] = [];
  const deckWordsRows: string[] = [];

  for (let i = 0; i < decks.length; i++) {
    const deck = decks[i];
    const deckId = uuidv4();

    // Deck row
    decksRows.push(
      `('${deckId}', '${deck.title.replace(/'/g, "''")}', '${(deck.description || "").replace(/'/g, "''")}, ${i + 1}')`,
    );

    // Deck words
    for (let j = 0; j < deck.wordIds.length; j++) {
      const wordId = uuidv4();
      deckWordsRows.push(
        `('${deckId}', '${wordId}', ${j + 1})`, // last field = order_index
      );
    }
  }

  // Write SQL files
  fs.writeFileSync(
    path.join(seedsDir, "009_decks.sql"),
    `INSERT INTO decks (id, title, description, order_index) VALUES\n${decksRows.join(",\n")};`,
  );

  fs.writeFileSync(
    path.join(seedsDir, "010_deck_words.sql"),
    `INSERT INTO deck_words (deck_id, headword_id, order_index) VALUES\n${deckWordsRows.join(",\n")};`,
  );

  console.log("Decks and deck_words seeds generated successfully!");
}

// Example usage
generateDeckSeeds([
  {
    title: "Best words for A2 learners",
    description: "100 essential A2 words with definitions and examples",
    wordIds: [1, 2, 3, 4, 5], // just example headerword IDs
  },
  {
    title: "Top 50 verbs",
    description: "Common verbs to practice",
    wordIds: [6, 7, 8, 9, 10],
  },
]);
