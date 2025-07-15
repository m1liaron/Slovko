import { Card, Group } from "../models/models";
import { sequelize } from "../db/sequelize";
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from "../common/types/AuthRequest";
import { Response } from "express";
import { sendError } from "../helpers";

const getAllGroups = async (req: AuthRequest, res: Response) => {
	const userId = req.user.id;
	try {
		const cards = await Group.findAll({
			where: { userId },
		});

		res.status(StatusCodes.OK).json(cards);
	} catch (error) {
		sendError(res, error);
	}
};

const getGroup = async (req: AuthRequest, res: Response) => {
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
		sendError(res, error);
	}
};

const addGroup = async (req: AuthRequest, res: Response) => {
	const data = req.body;
	const userId = req.user.id;
	try {
		const existGroup = await Group.findOne({
			where: {
				title: data.title,
				userId: userId,
				...(data.id != null ? { id: data.id } : {}),
			},
		});
		if (existGroup) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: "Group already exists" });
		}
		const newGroup = await Group.create({ ...data, userId });
		return res.status(200).json(newGroup);
	} catch (error) {
		sendError(res, error);
	}
};

const updateGroup = async (req: AuthRequest, res: Response) => {
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

		res.status(StatusCodes.OK).json(group);
	} catch (error) {
		sendError(res, error);
	}
};

const removeGroup = async (req: AuthRequest, res: Response) => {
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
			return;
		}

		await Card.destroy({ where: { groupId: id } });
		await card.destroy();
		res.status(200).json(card);
	} catch (error) {
		sendError(res, error);
	}
};

export {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
};
