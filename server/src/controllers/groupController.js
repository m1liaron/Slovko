const Group = require("../models/Group");
const { Card } = require("../models/models");
const { sequelize } = require("../db/sequelize");
const { StatusCodes } = require('http-status-codes');

const getAllGroups = async (req, res) => {
	const userId = req.user.id;
	try {
		const cards = await Group.findAll({
			where: { userId },
		});

		res.status(200).json(cards);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

const getGroup = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
	try {
		const group = await Group.findOne({
			where: { id, userId },
			include: [
				{
					model: Card,
					as: "cards",
					attributes: [], // Exclude individual cards from being returned
				},
			],
			attributes: {
				include: [
					// Calculate the count of cards with 'To Learn' status
					[
						sequelize.fn(
							"COUNT",
							sequelize.literal(
								`CASE WHEN cards.status = 'To Learn' THEN 1 END`,
							),
						),
						"learnToCardsAmount",
					],
					// Calculate the count of cards with 'Learned' status
					[
						sequelize.fn(
							"COUNT",
							sequelize.literal(
								`CASE WHEN cards.status = 'Learned' THEN 1 END`,
							),
						),
						"learnedCardsAmount",
					],
					// Calculate the count of cards with 'Know' status
					[
						sequelize.fn(
							"COUNT",
							sequelize.literal(`CASE WHEN cards.status = 'Know' THEN 1 END`),
						),
						"knowCardsAmount",
					],
				],
			},
			group: ["Group.id"], // Ensure correct grouping
			subQuery: false, // Necessary for aggregation queries with associations
		});
		if (!group) {
			res.status(200).send({ error: true, message: "Group does not exist" });
		}

		res.status(200).json(group);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

const addGroup = async (req, res) => {
	const data = req.body;
	try {
		const existGroup = await Group.findOne({ where: data.title });
		if(existGroup) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: "Group already exists" });
		}
		const newGroup = await Group.create({ ...data, userId: req.user.id });
		return res.status(200).json(newGroup);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

const updateGroup = async (req, res) => {
	try {
		const {
			params: { id: groupId },
			user: { id: userId },
		} = req;
		const updatedGroup = await Group.update(req.body, {
			where: { id: groupId, userId },
			returning: true,
		});

		if (updatedGroup[0] === 0) {
			return res.status(404).json({ error: true, message: "Group not found" });
		}

		const group = await Group.findOne({
			where: { id: groupId },
		});

		res.status(200).json(group);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

const removeGroup = async (req, res) => {
	try {
		const {
			user: { id: userId },
			params: { id },
		} = req;
		const card = await Group.findOne({
			where: { id, userId },
		});
		if (!card) {
			res.status(404).send({ error: true, message: "Card not found" });
		}

		await Card.destroy({ where: { groupId: id } });
		await card.destroy();
		res.status(200).json(card);
	} catch (error) {
		res
			.status(400)
			.send({ error: true, message: error.message || "Error login" });
	}
};

module.exports = {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
};
