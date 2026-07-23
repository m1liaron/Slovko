import { calculateCurMonthAndYearDate } from "@/helpers/calculateCurMonthAndYearDate.js";
import { HttpError } from "@/libs/constants/http-error.js";
import { type ResultAttributes } from "@/libs/types/request.type.js";

import { VALID_MODES } from "./libs/enums";
import { type SaveResultsRequest } from "./libs/types";
import { ResultRepository } from "./result.repository.js";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getAllWordsMode(results: ResultAttributes[], resultsMonths: string[]) {
  const modeMonthSum: {
    [mode: string]: { mistakes: number[]; wordLength: number[] };
  } = {};

  for (const result of results) {
    const month = MONTHS[new Date(result.createdAt).getMonth()];
    const index = resultsMonths.indexOf(month);

    if (index !== -1 && result.mode) {
      for (const modeItem of result.mode) {
        if (!modeMonthSum[modeItem.mode]) {
          const array = new Array(resultsMonths.length).fill(0);
          modeMonthSum[modeItem.mode] = {
            mistakes: [...array],
            wordLength: [...array],
          };
        }

        const mistakesForCard = modeItem.words.reduce(
          (acc, curr) => acc + curr.mistakesAmount,
          0,
        );

        modeMonthSum[modeItem.mode].mistakes[index] += mistakesForCard;
        modeMonthSum[modeItem.mode].wordLength[index] += modeItem.words.length;
      }
    }
  }

  return modeMonthSum;
}

export const resultService = {
  getResultsDetails(userId: string) {
    return ResultRepository.findAllWithModesByUserId(userId);
  },

  async getResultsStatistics(userId: string) {
    const resultsData = (await ResultRepository.findAllWithModesByUserId(
      userId,
    )) as any[];
    const results = resultsData.map((r) => r.get({ plain: true }));

    const resultsMonths: string[] = [];
    for (const result of results) {
      const month = MONTHS[new Date(result.createdAt).getMonth()];
      if (!resultsMonths.includes(month)) resultsMonths.push(month);
    }

    const amountMistakesCards = getAllWordsMode(results, resultsMonths);
    return { resultsMonths, amountMistakesCards };
  },

  async getResults(
    userId: string,
    month: string,
    year: string,
    page: string,
    limit: string,
  ) {
    const { startDate, endDate } = calculateCurMonthAndYearDate(month, year);

    const pageNumber = Number.parseInt(page, 10) || 1;
    const itemsPerPage = Number.parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    const { rows, count } =
      await ResultRepository.findAndCountByUserAndDateRange(
        userId,
        startDate,
        endDate,
        itemsPerPage,
        offset,
      );

    const haveMoreResults = offset + itemsPerPage < count;
    const earliestResult = await ResultRepository.findEarliestByUserId(userId);

    return {
      results: rows,
      haveMoreResults,
      firstResult: earliestResult ? earliestResult.createdAt : null,
    };
  },

  async getResultDetails(userId: string, resultId: string) {
    const result = await ResultRepository.findByIdWithModes(userId, resultId);
    if (!result) {
      throw HttpError.notFound("Result is not find");
    }
    return result;
  },

  async saveResults(userId: string, body: SaveResultsRequest) {
    const { title, startedLearn, completionTime, ...data } = body;

    if (!Object.entries(data).length) {
      throw HttpError.badRequest("No data provided as a result");
    }

    const newResultData = await ResultRepository.createResult({
      title,
      userId,
      startedLearn,
      completionTime,
    });
    const newResult = newResultData.toJSON();

    const correctAnswersAmount = Object.values(data)
      .filter((key) => Array.isArray(key))
      .reduce(
        (total, key) =>
          total + key.filter((item) => item.mistakesAmount === 0).length,
        0,
      );

    const userData = await ResultRepository.findUserById(userId);
    const user = userData?.get({ plain: true });
    if (user) {
      await ResultRepository.updatePoints(
        userId,
        user.points + correctAnswersAmount * 10,
      );
    }

    const resultModes = await Promise.all(
      Object.keys(data)
        .filter((mode): mode is (typeof VALID_MODES)[number] =>
          VALID_MODES.includes(mode as any),
        )
        .map(async (mode) => {
          const resultModeData = await ResultRepository.createResultMode({
            mode,
            resultId: newResult.id,
          });
          return resultModeData.get({ plain: true });
        }),
    );

    await Promise.all(
      Object.entries(data).map(([mode, words]) => {
        const resultMode = resultModes.find((rm) => rm.mode === mode);
        if (!resultMode) return;

        return Promise.all(
          (words as any[]).map((word) =>
            ResultRepository.createWordResult({
              word: word.word,
              translate: word.translateWord,
              mistakesAmount: word.mistakesAmount,
              resultModeId: resultMode.id,
            }),
          ),
        );
      }),
    );

    return ResultRepository.findByUserAndId(userId, newResult.id);
  },
};
