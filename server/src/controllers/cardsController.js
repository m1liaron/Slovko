const Card = require("../models/Card");
const Image = require("../models/Image");
const calculateNextReviewDate = require("../helpers/calculateNextReviewDate");
const { Op } = require("sequelize");
const { Group } = require("../models/models");
const { StatusCodes } = require("http-status-codes");
const { getDictionaryData } = require("../helpers/getDictionaryData");

const getRepeatedCards = async (req, res) => {
	try {
		const groups = await Group.findAll({
			where: {
				userId: req.user.id,
			},
			attributes: ["id", "title"],
		});
		const repeatedCardsData = await Promise.all(
			groups.map(async (group) => {
				const cards = await Card.findAll({
					where: {
						groupId: group.id,
						nextReviewAt: {
							[Op.lte]: new Date(), // Cards ready for review
						},
					},
					attributes: ["id"], // Fetch only card IDs
				});

				return {
					title: group.title,
					cards: cards.map((card) => card.id), // Extract IDs into an array
				};
			}),
		);

		const filteredData = repeatedCardsData.filter(
			(group) => group.cards.length > 0,
		);

		res.status(200).json(filteredData);
	} catch (error) {
		res.status(400).send({
			error: true,
			message: error.message || "Error get repeated cards",
		});
	}
};

const getCardsFromIds = async (req, res) => {
	try {
		const cardsIds = req.body;
		if (!Array.isArray(cardsIds) || cardsIds.length === 0) {
			return res
				.status(400)
				.send({ error: true, message: "Invalid card IDs provided" });
		}
		const cards = await Card.findAll({
			where: {
				id: {
					[Op.in]: cardsIds, // Match any of the IDs in the array
				},
			},
			include: [{ model: Image, as: "image" }],
		});

		res.status(200).json(cards);
	} catch (error) {
		res.status(400).send({
			error: true,
			message: error.message || "Error get cards from ids",
		});
	}
};

const getAllCards = async (req, res) => {
	const { groupId } = req.params;
	try {
		const cards = await Card.findAll({
			where: {
				groupId,
				status: {
					[Op.in]: ["To Learn", "Repeated"],
				},
			},
			include: [{ model: Image, as: "image" }],
		});

		const updatedCards = await Promise.all(
			cards.map(async (card) => {
				if (new Date(card.nextReviewAt) - new Date() < 0) {
					card.status = "To Learn";
					await card.save();
				}
				return card;
			}),
		);

		res.status(200).json(updatedCards);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error get all cards" });
	}
};

const getAllStatusCards = async (req, res) => {
	const { status, groupId } = req.params;
	try {
		const cards = await Card.findAll({
			where: { status, groupId },
		});

		res.status(200).json(cards);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Getting cards" });
	}
};

const updateCardsAfterReview = async (req, res) => {
	try {
		const cardsIds = req.body;
		if (!Array.isArray(cardsIds) && cardsIds.length <= 0) {
			return res.status(400).send({
				error: "Invalid request. Provide an array of card IDs.",
			});
		}
		const cardsToUpdate = await Card.findAll({
			where: { id: { [Op.in]: cardsIds } },
		});

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (const card of cardsToUpdate) {
			const cardNextReview = card.nextReviewAt
				? new Date(card.nextReviewAt).setHours(0, 0, 0, 0)
				: null;

			if (cardNextReview && cardNextReview >= today.getTime()) {
				continue;
			}

			const newReviewCount = card.reviewCount;
			const nextReviewDate = calculateNextReviewDate(newReviewCount);

			if (card.reviewCount >= 12) {
				card.status = "Know";
			} else {
				card.status = "Learned";
			}

			card.status = "Repeated";
			card.learnedAt = new Date();
			card.reviewCount = newReviewCount;
			card.nextReviewAt = nextReviewDate;

			await card.save();
		}

		res.status(200).json(cardsToUpdate);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error update card" });
	}
};

const addCard = async (req, res) => {
	const { imageUri, ...data } = req.body;
	try {
		const findCard = await Card.findOne({
			where: {
				groupId: data.groupId,
				word: {
					[Op.iLike]: data.word,
				},
			},
		});
		if (findCard) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.send({ error: true, message: "Картка з цим словом вже існує" });
		}

		const { definition, example } = await getDictionaryData(data.word);

		const image = await Image.create({ url: imageUri });
		const newCard = await Card.create({
			imageId: image.id,
			...data,
			definition,
			example,
		});

		const card = await Card.findOne({
			where: { id: newCard.id },
			include: [{ model: Image, as: "image" }],
		});

		return res.status(200).json(card);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error creating card" });
	}
};

const updateCard = async (req, res) => {
	try {
		const cardId = req.params.id;
		const { groupId } = req.body;
		const updatedCard = await Card.update(req.body, {
			where: { id: cardId, groupId },
			returning: true,
		});

		if (updatedCard[0] === 0) {
			return res.status(404).json({ error: true, message: "Card not found" });
		}

		const card = await Card.findOne({
			where: { id: cardId },
		});

		res.status(200).json(card);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

const removeCard = async (req, res) => {
	try {
		const cardId = req.params.id;
		const card = await Card.findOne({
			where: { id: cardId },
		});
		if (!card) {
			res.status(404).send({ error: true, message: "Card not found" });
			return;
		}
		await card.destroy();
		res.status(200).json(cardId);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

module.exports = {
	getAllCards,
	addCard,
	removeCard,
	updateCard,
	updateCardsAfterReview,
	getAllStatusCards,
	getRepeatedCards,
	getCardsFromIds,
};
