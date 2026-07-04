import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Client } from "pg";
import { EnvVariables } from "@/libs/enums";

type Phrase = {
  phrase: string;
  definition: string;
};

type Idiom = {
  idiom: string;
  definition: string;
};

type Example = {
  sentence: string;
  definition: string;
};

type Sense = {
  definition: string;
  collocations: string[];
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
  idioms: Idiom[];
  phrases: Phrase[];
};

type Entry = {
  headword: string;
  pos: string;
  level: string;
  senses: Sense[];
};

interface LanguageData {
  code: string;
  name: string;
}

const client = new Client({
  host: "localhost",
  port: 5432,
  database: EnvVariables.DATABASE_NAME,
  user: EnvVariables.DATABASE_USER_NAME,
  password: EnvVariables.DATABASE_PASSWORD,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const filePath = "D:\\Programming\\projects\\Slovko\\backend\\src\\db\\data\\wordson";
const filePath = path.normalize(path.join(__dirname, "../data/words.json"));

const languagesData: LanguageData[] = [{ code: "en", name: "English" }];
async function insertWord(entry: Entry) {
  // 1. Languages

  const languages = await client.query(
    `
        INSERT INTO languages (code, name)
        VALUES ($1, $2)
        RETURNING id
        `,
    [languagesData[0].code, languagesData[0].name],
  );

  const languageId = languages.rows[0].id;

  // 1. HEADWORD
  const headwordRes = await client.query(
    `
    INSERT INTO headwords (word, pos, level, language_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [entry.headword, entry.pos, entry.level, languageId],
  );

  const headwordId = headwordRes.rows[0].id;

  // 2. SENSES
  for (const sense of entry.senses) {
    const senseRes = await client.query(
      `
      INSERT INTO senses (headword_id, definition)
      VALUES ($1, $2)
      RETURNING id
      `,
      [headwordId, sense.definition],
    );

    const senseId = senseRes.rows[0].id;

    // 3. EXAMPLES
    for (const ex of sense.examples || []) {
      await client.query(
        `INSERT INTO examples (sense_id, sentence, definition) VALUES ($1, $2, $3)`,
        [senseId, ex.sentence, ex.definition],
      );
    }

    // 4. COLLOCATIONS
    for (const col of sense.collocations || []) {
      await client.query(
        `INSERT INTO collocations (sense_id, collocation) VALUES ($1, $2)`,
        [senseId, col],
      );
    }

    // 5. SYNONYMS
    for (const syn of sense.synonyms || []) {
      await client.query(
        `INSERT INTO synonyms (sense_id, synonym) VALUES ($1, $2)`,
        [senseId, syn],
      );
    }

    // 6. PHRASES
    for (const phr of sense.phrases || []) {
      await client.query(
        `INSERT INTO phrases (sense_id, phrase, definition) VALUES ($1, $2, $3)`,
        [senseId, phr.phrase, phr.definition],
      );
    }

    // 7. IDIOMS
    for (const idiom of sense.idioms || []) {
      await client.query(
        `INSERT INTO idioms (sense_id, idiom, definition) VALUES ($1, $2, $3)`,
        [senseId, idiom.idiom, idiom.definition],
      );
    }
  }
}

async function importJson(path: string) {
  await client.connect();

  const raw = fs.readFileSync(path, "utf-8");
  const data = JSON.parse(raw);

  for (const entry of data) {
    console.log("Importing:", entry.headword);
    await insertWord(entry);
  }

  console.log("Done.");
  await client.end();
}

console.log("filePath:", filePath);
console.log("Checking file exists:", fs.existsSync(filePath));
importJson(filePath);
