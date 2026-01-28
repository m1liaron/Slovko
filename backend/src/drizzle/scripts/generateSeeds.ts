import fs from "fs";
import path from "path";

const words = JSON.parse(
  fs.readFileSync("../backend/src/drizzle/data/words.json", "utf-8"),
);

// Create folder for seeds if not exists
const seedsDir = "./src/drizzle/seeds";
if (!fs.existsSync(seedsDir)) fs.mkdirSync(seedsDir, { recursive: true });

// Arrays to accumulate SQL rows
const headwordsRows: string[] = [];
const sensesRows: string[] = [];
const examplesRows: string[] = [];
const collocationsRows: string[] = [];
const synonymsRows: string[] = [];
const antonymsRows: string[] = [];
const idiomsRows: string[] = [];
const phrasesRows: string[] = [];

let senseCounter = 0;
let exampleCounter = 0;
let collocationCounter = 0;
let synonymCounter = 0;
let antonymCounter = 0;
let idiomCounter = 0;
let phraseCounter = 0;

for (let i = 0; i < words.length; i++) {
  const word = words[i];
  const headwordId = i + 1;
  headwordsRows.push(
    `('${headwordId}', '${word.headword.replace(/'/g, "''")}', '${
      word.pos
    }', '${word.level}')`,
  );

  for (let j = 0; j < word.senses.length; j++) {
    const sense = word.senses[j];
    senseCounter++;
    const senseId = senseCounter;
    sensesRows.push(
      `('${senseId}', '${headwordId}', '${sense.definition.replace(
        /'/g,
        "''",
      )}')`,
    );

    // Collocations
    if (sense.collocations) {
      for (let k = 0; k < sense.collocations.length; k++) {
        collocationCounter++;
        collocationsRows.push(
          `('${collocationCounter}', '${senseId}', '${sense.collocations[
            k
          ].replace(/'/g, "''")}')`,
        );
      }
    }

    // Examples
    if (sense.examples) {
      for (let k = 0; k < sense.examples.length; k++) {
        exampleCounter++;
        const ex = sense.examples[k];
        examplesRows.push(
          `('${exampleCounter}', '${senseId}', '${ex.sentence.replace(
            /'/g,
            "''",
          )}', '${ex.definition.replace(/'/g, "''")}')`,
        );
      }
    }

    // Synonyms
    if (sense.synonyms) {
      for (let k = 0; k < sense.synonyms.length; k++) {
        synonymCounter++;
        synonymsRows.push(
          `('${synonymCounter}', '${senseId}', '${sense.synonyms[k].replace(
            /'/g,
            "''",
          )}')`,
        );
      }
    }

    // Antonyms
    if (sense.antonyms) {
      for (let k = 0; k < sense.antonyms.length; k++) {
        antonymCounter++;
        antonymsRows.push(
          `('${antonymCounter}', '${senseId}', '${sense.antonyms[k].replace(
            /'/g,
            "''",
          )}')`,
        );
      }
    }

    // Idioms
    if (sense.idioms) {
      for (let k = 0; k < sense.idioms.length; k++) {
        idiomCounter++;
        const idiom = sense.idioms[k];
        idiomsRows.push(
          `('${idiomCounter}', '${senseId}', '${idiom.idiom.replace(
            /'/g,
            "''",
          )}', '${idiom.definition.replace(/'/g, "''")}')`,
        );
      }
    }

    // Phrases
    if (sense.phrases) {
      for (let k = 0; k < sense.phrases.length; k++) {
        phraseCounter++;
        const phrase = sense.phrases[k];
        phrasesRows.push(
          `('${phraseCounter}', '${senseId}', '${phrase.phrase.replace(
            /'/g,
            "''",
          )}', '${phrase.definition.replace(/'/g, "''")}')`,
        );
      }
    }
  }
}

// Write all seed files
fs.writeFileSync(
  path.join(seedsDir, "001_headwords.sql"),
  `INSERT INTO headwords (id, word, pos, level) VALUES\n${headwordsRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "002_senses.sql"),
  `INSERT INTO senses (id, headword_id, definition) VALUES\n${sensesRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "003_examples.sql"),
  `INSERT INTO examples (id, sense_id, sentence, definition) VALUES\n${examplesRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "004_collocations.sql"),
  `INSERT INTO collocations (id, sense_id, text) VALUES\n${collocationsRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "005_synonyms.sql"),
  `INSERT INTO synonyms (id, sense_id, text) VALUES\n${synonymsRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "006_antonyms.sql"),
  `INSERT INTO antonyms (id, sense_id, text) VALUES\n${antonymsRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "007_idioms.sql"),
  `INSERT INTO idioms (id, sense_id, idiom, definition) VALUES\n${idiomsRows.join(
    ",\n",
  )};`,
);

fs.writeFileSync(
  path.join(seedsDir, "008_phrases.sql"),
  `INSERT INTO phrases (id, sense_id, phrase, definition) VALUES\n${phrasesRows.join(
    ",\n",
  )};`,
);

console.log(
  `All seed files generated successfully with deterministic IDs! Added ${headwordsRows.length} words`,
);
