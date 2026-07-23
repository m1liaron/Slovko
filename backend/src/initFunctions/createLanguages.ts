import { LanguageRepository } from "@/modules/language/language.repository";
import { v4 as uuidv4 } from "uuid";


const predefinedLanguages = [
  { code: "en", name: "English", symbol: "🇬🇧" },
  { code: "de", name: "German", symbol: "🇩🇪" },
  { code: "es", name: "Spanish", symbol: "🇪🇸" },
  { code: "fr", name: "French", symbol: "🇫🇷" },
  { code: "it", name: "Italian", symbol: "🇮🇹" },
  { code: "pt", name: "Portuguese", symbol: "🇵🇹" },
  { code: "zh", name: "Chinese", symbol: "🇨🇳" },
  { code: "ja", name: "Japanese", symbol: "🇯🇵" },
  { code: "ko", name: "Korean", symbol: "🇰🇷" },
  { code: "nl", name: "Dutch", symbol: "🇳🇱" },
  { code: "sv", name: "Swedish", symbol: "🇸🇪" },
  { code: "no", name: "Norwegian", symbol: "🇳🇴" },
  { code: "da", name: "Danish", symbol: "🇩🇰" },
  { code: "fi", name: "Finnish", symbol: "🇫🇮" },
  { code: "pl", name: "Polish", symbol: "🇵🇱" },
  { code: "tr", name: "Turkish", symbol: "🇹🇷" },
  { code: "ar", name: "Arabic", symbol: "🇸🇦" },
  { code: "hi", name: "Hindi", symbol: "🇮🇳" },
  { code: "uk", name: "Ukrainian", symbol: "🇺🇦" },
];

export async function ensureLanguages() {
  for (const lang of predefinedLanguages) {
    const foundLanguage = await LanguageRepository.findByCode(lang.code);

    if (!foundLanguage) {
      await LanguageRepository.create({ id: uuidv4(), title: lang.name, symbol: lang.symbol, code: lang.code });
      console.log("Added language to the database:", lang.name);
    }
  }
}
