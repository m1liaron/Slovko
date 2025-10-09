import { Language } from "../models/Language.js";
import { v4 as uuidv4 } from "uuid";

const predefinedLanguages = [
  { code: "en", name: "English", symbol: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "de", name: "German", symbol: "🇩🇪" },
  { code: "fr", name: "French", symbol: "🇫🇷" },
];

export async function ensureLanguages() {
  for (const lang of predefinedLanguages) {
    await Language.findOrCreate({
      where: { code: lang.code },
      defaults: { id: uuidv4(), title: lang.name, symbol: lang.symbol },
    });
  }
}
