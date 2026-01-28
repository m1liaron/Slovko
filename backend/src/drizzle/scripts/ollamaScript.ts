import fs from "fs";
import readline from "readline";

import fetch from "node-fetch";

const dbFolder = "src/drizzle/data";
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OUTPUT_FILE = `${dbFolder}/words-test.json`;
const INPUT_FILE_WORDS = `${dbFolder}/oxford-3000.csv`;

async function ask(question: string) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt: question,
      stream: false,
    }),
  });

  const text = await res.text();

  const start = text.indexOf("{");
  if (start === -1) throw new Error("Invalid response");

  return JSON.parse(text.slice(start)).response;
}

async function processCSV(csvPath: string) {
  let results = [];
  const processedWords = new Set();

  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
    for (const entry of results) {
      processedWords.add(entry.headword.toLowerCase());
    }
    console.log(`Already processed ${processedWords.size} words.`);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    if (!line.trim()) continue;

    const [word, cls, level] = line.split(",");
    if (!word || processedWords.has(word.toLowerCase())) {
      continue;
    }

    const startTime = Date.now();

    console.log(`Processing: ${word}`);

    const prompt = `
      Generate JSON ONLY. No explanations, no markdown, no comments.

      You MUST follow this exact structure:

      {
        "senses": [
          {
            "partOfSpeech": "<one of the allowed values>",
            "definition": "<short, clear definition>",
            "collocations": [],
            "examples": [],
            "synonyms": [],
            "antonyms": [],
            "idioms": [],
            "phrases": []
          }
        ]
      }

      Rules you MUST follow:

      1. "senses" MUST be an array.
      2. If the word has multiple meanings, create MULTIPLE objects inside "senses".
      3. Each sense MUST have exactly ONE part of speech.
      4. The "partOfSpeech" value MUST be ONE of the following and NOTHING else:

      - noun
      - verb
      - adjective
      - adverb
      - pronoun
      - determiner
      - preposition
      - conjunction
      - interjection

      5. Do NOT invent new parts of speech.
      6. Do NOT use labels like "modal verb", "auxiliary", "phrasal verb", etc.
      7. All arrays must exist, even if empty.
      8. Output MUST be valid JSON and parseable.

      Word to generate data for: "${word}"

    `;

    let response;
    try {
      response = await ask(prompt);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error for: ", word, error.message);
        continue;
      }
    }

    let json;
    try {
      json = JSON.parse(response);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Failed to parse JSON from model:", word);
        console.log("Error for: ", error.message);
        continue;
      }
      continue;
    }

    const { headWord: _dummyWord, _pos, ...restData } = json;

    const entry = {
      headword: word,
      pos: cls,
      level,
      senses: [restData],
    };

    results.push(entry);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `Done: ${word} (Processed in ${elapsedSeconds} seconds). ${processedWords.size + 1}th word`,
    );

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("All words processed.");
}

processCSV(INPUT_FILE_WORDS);
