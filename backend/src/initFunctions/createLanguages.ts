import { Language } from "../models/Language.js";
import { v4 as uuidv4 } from "uuid";

const predefinedLanguages = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
];

export async function ensureLanguages() {
  for (const lang of predefinedLanguages) {
    await Language.findOrCreate({
      where: { code: lang.code },
      defaults: { id: uuidv4(), title: lang.name },
    });
  }
}
