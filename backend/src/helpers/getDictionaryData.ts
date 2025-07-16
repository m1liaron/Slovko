import { dictionaryAPi } from "../api/dictionaryAPi.js";
import axios from "axios";

const getDictionaryData = async (word: string) => {
	const dictionaryApiResponse = await axios.get(`${dictionaryAPi}${word}`);
	let definition = "";
	let example = "";
	if (dictionaryApiResponse) {
		definition =
			dictionaryApiResponse?.data[0]?.meanings[2]?.definitions[0]?.definition;
		example =
			dictionaryApiResponse?.data[0]?.meanings[2]?.definitions[0]?.example;
	}

	return { definition, example };
};

export { getDictionaryData };
