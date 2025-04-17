import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";

const translations = {
	en: {
		mainScreen: {
			alreadyPassed: "It has been",
			daysPassed: "days since the beginning of the war.",
			repeatWords: "Repeat words",
			repeatAll: "Repeat all",
			notificationTitle: "Time to review!",
			notificationBody: "You have {{count}} words to review.",
			saveUkraine: "Save Ukraine!"
		}
	},
	uk: {
		mainScreen: {
			alreadyPassed: "Вже минуло",
			daysPassed: "з початку війни.",
			repeatWords: "Повторити слова",
			repeatAll: "Повторити усі",
			notificationTitle: "Час для повторення!",
			notificationBody: "У вас є {{count}} слова для повторення.",
			saveUkraine: "Save Ukraine!"
		}
	}
};

export const i18n = new I18n(translations);

i18n.enableFallback = true;
// i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.locale = "uk";