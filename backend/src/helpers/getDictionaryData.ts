import axios from "axios";

import { dictionaryAPi } from "../api/dictionaryAPi.js";

const getDictionaryData = async (word: string) => {
  try {
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
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Word not found in dictionary — not a crash, just no data
      return { definition: "", example: "" };
    }
    throw error; // re-throw unexpected errors (network
  }
};

export { getDictionaryData };
