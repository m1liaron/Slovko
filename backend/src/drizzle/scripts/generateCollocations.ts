import fs from "fs";
import readline from "readline";

import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OUTPUT_FILE = "wordson";

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

  const jsonStart = text.indexOf("{");
  if (jsonStart === -1) {
    throw new Error("Invalid Ollama response");
  }

  const parsed = JSON.parse(text.slice(jsonStart));
  return parsed.response;
}

async function processCSV(csvPath: string) {
  let results = [];

  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });

  let first = true;

  for await (const line of rl) {
    if (first) {
      first = false;
      continue;
    }
    if (!line.trim()) continue;

    const [word, cls, level] = line.split(",");
    if (!word) continue;

    console.log("Processing: ", word);

    const prompt = `
      Generate JSON ONLY. No explanation. Structure MUST be:

      {
        "collocations": [...],
        "examples": [...],
        "synonyms": [...],
        "antonyms": [...],
        "idioms": [...],
        "phrases": [...]
      }

      Generate natural, correct English content for the word: "${word}".
    `;

    let response;
    try {
      response = await ask(prompt);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error for: ", word, error.message);
      }
      continue;
    }

    let json;
    try {
      json = JSON.parse(response);
    } catch {
      console.log("Failed to parse JSON from model:", word);
      continue;
    }

    const { word: _dummyWord, _partOfSpeech, ...restData } = json;

    results.push({
      headword: word,
      pos: cls,
      level,
      senses: [restData],
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    await new Promise((r) => setTimeout(r, 300));

    console.log(`Done with word: ${word}`);
  }

  console.log("Done");
}

processCSV("oxford-3000-test.csv");
