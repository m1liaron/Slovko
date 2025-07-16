import { Op } from "sequelize";
import {
	calculateCurMonthAndYearDate,
} from "../helpers/calculateCurMonthAndYearDate.js";
import { Result, ResultMode, WordResult, User } from "../models/models.js";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../common/types/AuthRequest.type.js";
import { Response } from "express";
import { sendError } from "../helpers/index.js";
import { ResultAttributes } from "../common/types/Request.type.js";

interface ResultsQuery {
	month: string;
	year: string;
	page?: string;
	limit?: string;
}

type ResultsCard = {
	wordId: string;
	word: string;
	translateWord: string;
	mistakesAmount: number;
};

type SaveResultsRequest = {
	title: string | Date;
	flashCards: ResultsCard[];
	quiz: ResultsCard[];
	guessWord: ResultsCard[];
	startedLearn: Date;
	completionTime: Date;
};

const getResultsDetails = async (req: AuthRequest, res: Response) => {
	try {
		const results = await Result.findAll({
			where: { userId: req.user.id },
			include: [
				{
					model: ResultMode,
					as: "mode",
					include: [
						{
							model: WordResult,
							as: "words",
						},
					],
				},
			],
		});

		res.status(StatusCodes.OK).json(results);
	} catch (error) {
		sendError(res, error);
	}
};

const getResultsStatistics = async (req: AuthRequest, res: Response) => {
	try {
		const results = await Result.findAll({
			where: { userId: req.user.id },
			include: [
				{
					model: ResultMode,
					as: "mode",
					include: [
						{
							model: WordResult,
							as: "words",
						},
					],
				},
			],
		}) as (Result & { mode: (ResultMode & { words: WordResult[] })[] })[];

		const months = [
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
		const resultsMonths: Partial<typeof months> = [];

		results.map((result) => {
			const month = months[new Date(result.createdAt).getMonth()];
			if (!resultsMonths.includes(month)) {
				return resultsMonths.push(month);
			}
		});

		function getAllWordsMode(results: ResultAttributes[]) {
			const modeMonthSum: {
				[mode: string]: {
					mistakes: number[];
					wordLength: number[]
				}
			} = {};

			for (const result of results) {
				const month = months[new Date(result.createdAt).getMonth()];
				const index = resultsMonths.indexOf(month); // Find the month index in resultsMonthes

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
						const wordCountForCard = modeItem.words.length;

						modeMonthSum[modeItem.mode].mistakes[index] += mistakesForCard;
						modeMonthSum[modeItem.mode].wordLength[index] += wordCountForCard;
					}
				}
			}

			return modeMonthSum;
		}

		const amountMistakesCards = getAllWordsMode(results);
		res.status(200).json({ resultsMonths, amountMistakesCards });
	} catch (error) {
		sendError(res, error);
	}
};

const getResults = async (req: AuthRequest<ResultsQuery>, res: Response) => {
	try {
		const { month, year, page = "0", limit = "10" } = req.query as ResultsQuery;

		const { startDate, endDate } = calculateCurMonthAndYearDate(
			month,
			year,
			res,
		);
		const pageNumber = Number.parseInt(page, 10) || 1;
		const itemsPerPage = Number.parseInt(limit, 10) || 10;
		const offset = (pageNumber - 1) * itemsPerPage;

		const { rows, count } = await Result.findAndCountAll({
			where: {
				userId: req.user.id,
				createdAt: { [Op.between]: [startDate, endDate] },
			},
			order: [["createdAt", "DESC"]],
			limit: itemsPerPage,
			offset
		});
		if (!rows) {
			return res
				.status(404)
				.send({ error: true, message: "Results is not find" });
		}

		const haveMoreResults = offset + itemsPerPage < count;

		const earliestResult = await Result.findOne({
			where: { userId: req.user.id },
			order: [["createdAt", "ASC"]],
			attributes: ["createdAt"]
		});
		const findResultDate = earliestResult ? earliestResult.createdAt : null;

		res.status(200).json({ results: rows, haveMoreResults, firstResult: findResultDate });
	} catch (error) {
		sendError(res, error);
	}
};

const getResultDetails = async (req: AuthRequest, res: Response) => {
	const { resultId } = req.params;
	try {
		const result = await Result.findOne({
			where: { userId: req.user.id, id: resultId },
			include: {
				model: ResultMode,
				as: "mode",
				include: [
					{
						model: WordResult,
						as: "words",
					},
				],
			},
		});
		if (!result) {
			return res
				.status(404)
				.send({ error: true, message: "Result is not find" });
		}
		res.status(200).json(result);
	} catch (error) {
		sendError(res, error);
	}
};

const saveResults = async (req: AuthRequest<SaveResultsRequest>, res: Response) => {
	const { title, startedLearn, completionTime, ...data } = req.body as SaveResultsRequest;
	const {
		user: { id },
	} = req;

	try {
		const newResult = await Result.create({
			title,
			userId: id,
			startedLearn,
			completionTime,
		});
		const correctAnswersAmount = Object.values(data)
			.filter((key) => Array.isArray(key))
			.reduce((total, key) => {
				return total + key.filter((item) => item.mistakesAmount === 0).length;
			}, 0);
		const user = await User.findByPk(id);
		if (user) {
			await User.update(
				{ points: user.points + correctAnswersAmount * 10 },
				{
					where: { id },
				},
			);
		}

		const resultModes = await Promise.all(
			Object.keys(data).map((mode) =>
				ResultMode.create({
					mode: mode,
					resultId: newResult.id,
				}),
			),
		);

		if (!Object.entries(data).length) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "No data provided as a result" });
		}

		await Promise.all(
			Object.entries(data).map(([mode, words]) => {
				const resultMode = resultModes.find((rm) => rm.mode === mode);
				if (resultMode) {
					return Promise.all(
						words.map((word) =>
							WordResult.create({
								word: word.word,
								translate: word.translateWord,
								mistakesAmount: word.mistakesAmount,
								resultModeId: resultMode.id,
							}),
						),
					);
				}
			}),
		);

		const result = await Result.findOne({
			where: { userId: id, id: newResult.id },
		});

		// Return the result as a response
		res.status(200).json(result);
	} catch (error) {
		sendError(res, error);
	}
};

export {
	saveResults,
	getResults,
	getResultDetails,
	getResultsDetails,
	getResultsStatistics,
};
