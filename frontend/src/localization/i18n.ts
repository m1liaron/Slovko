import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import { translations } from "./translations";

export const i18n = new I18n(translations);

i18n.enableFallback = true;
// i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.locale = "uk";