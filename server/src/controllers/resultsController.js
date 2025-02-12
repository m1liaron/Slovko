const { Result, ResultMode, WordResult, User } = require("../models/models");

const getResultsDetails = async (req, res) => {
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

		res.status(200).json(results);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error saving results" });
	}
};

const getResultsStatistics = async (req, res) => {
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

		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"Jule",
			"June",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const resultsMonths = [];

		results.map((result) => {
			const month = months[new Date(result.createdAt).getMonth()];
			if (!resultsMonths.includes(month)) {
				return resultsMonths.push(month);
			}
		});

		function getAllWordsMode(results) {
			const modeMonthSum = {};

			for(const result of results) {
				const month = months[new Date(result.createdAt).getMonth()];
				const index = resultsMonths.indexOf(month); // Find the month index in resultsMonthes

				if (index !== -1) {
					for(const modeItem of result) {
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
		res
			.status(400)
			.send({ error: true, message: error.message || "Error saving results" });
	}
};

const getResults = async (req, res) => {
	try {
		const result = await Result.findAll({
			where: { userId: req.user.id },
			order: [["createdAt", "DESC"]],
		});
		if (!result) {
			return res
				.status(404)
				.send({ error: true, message: "Result is not find" });
		}
		res.status(200).json(result);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error saving results" });
	}
};

const getResultDetails = async (req, res) => {
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
		res
			.status(400)
			.send({ error: true, message: error.message || "Error saving results" });
	}
};

const saveResults = async (req, res) => {
	const {
		body: { title, startedLearn, completionTime, ...data },
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
		await User.update(
			{ points: user.points + correctAnswersAmount * 10 },
			{
				where: { id },
			},
		);

		const resultModes = await Promise.all(
			Object.keys(data).map((mode) =>
				ResultMode.create({
					mode: mode,
					resultId: newResult.id,
				}),
			),
		);

		await Promise.all(
			Object.entries(data).map(([mode, words]) => {
				const resultMode = resultModes.find((rm) => rm.mode === mode);
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
			}),
		);

		const result = await Result.findOne({
			where: { userId: id, id: newResult.id },
		});

		// Return the result as a response
		res.status(200).json(result);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error saving results" });
	}
};

module.exports = {
	saveResults,
	getResults,
	getResultDetails,
	getResultsDetails,
	getResultsStatistics,
};
