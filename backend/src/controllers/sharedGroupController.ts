import {
	SharedGroup,
	SharedCard,
	Group,
	Card,
	User,
} from "../models/models.js";
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from "express";
import { AuthRequest } from "../common/types/AuthRequest.type.js";
import { sendError } from "../helpers/index.js";

interface SharedGroupsQuery {
	month: string;
	year: string;
	page?: string;
	limit?: string;
}

const createSharedGroup = async (req: AuthRequest, res: Response) => {
	const {
		body: { groupId, title, isAnonymous },
		user: { id },
	} = req;
	try {

		const group = await Group.findOne({
			where: { id: groupId },
			include: [
				{
					model: Card,
					as: "cards",
				}
			],
		});
		if (!group || !group.cards) {
			return res.status(404).json({ error: true, message: "Group is not defined" });
		}
		const sharedGroup = await SharedGroup.create({
			title: title ? title : group.title,
			userId: id,
			isAnonymous,
			wordsLength: group.cards.length
		});
		if (group.cards.length > 0) {
			await Promise.all(
				group.cards.map(async (card) => {
					await SharedCard.create({
						word: card.word,
						translateWord: card.translateWord,
						sharedGroupId: sharedGroup.id,
					});
				}),
			);
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: "There are no cards to share!" });
		}

		const sharedGroupWithUser = await SharedGroup.findOne({
			where: { id: sharedGroup.id },
			include: {
				model: User,
				as: "user",
				attributes: ["id", "name", "email", "image"],
			},
		});

		res.status(200).json(sharedGroupWithUser);
	} catch (error) {
		sendError(res, error);
	}
};

const getAllSharedGroups = async (req: AuthRequest<SharedGroupsQuery>, res: Response) => {
	try {
		const {
			page = "0",
			limit = "10",
		} = req.query as SharedGroupsQuery;
		const allSharedGroups = await SharedGroup.findAll({
			include: {
				model: User,
				as: "user",
				attributes: { exclude: ["password"] },
			},
		});

		const pageNumber = Number.parseInt(page, 10) || 1;
		const itemsPerPage = Number.parseInt(limit, 10) || 5;
		const skip = (pageNumber - 1) * itemsPerPage;
		const filteredSharedGroups = allSharedGroups.slice(skip, skip + itemsPerPage);
		const haveMoreSharedGroups = skip + itemsPerPage < allSharedGroups.length;

		res.status(200).json({ sharedGroups: filteredSharedGroups, haveMoreSharedGroups });
	} catch (error) {
		sendError(res, error);
	}
};

const getSharedGroup = async (req: Request, res: Response) => {
	try {
		const sharedGroup = await SharedGroup.findOne({
			where: { id: req.params.sharedGroupId },
			include: [
				{
					model: SharedCard,
					as: "sharedCards",
				},
				{
					model: User,
					as: "user",
					attributes: { exclude: ["password"] },
				},
			],
		});
		res.status(200).json(sharedGroup);
	} catch (error) {
		sendError(res, error);
	}
};

const removeSharedGroup = async (req: AuthRequest, res: Response) => {
	try {
		const sharedId = req.params.sharedGroupId;
		const sharedGroup = await SharedGroup.findOne({
			where: { id: sharedId, userId: req.user.id },
		});
		if (!sharedGroup) {
			return res.status(404).json({ error: true, message: "Group not found" });
		}
		const { id: sharedGroupId } = sharedGroup;
		if (sharedGroup.userId !== req.user.id) {
			res
				.status(400)
				.json({ error: true, message: "You are not owner of this group!" });
		}

		await sharedGroup.destroy();

		res.status(200).json(sharedGroupId);
	} catch (error) {
		sendError(res, error);
	}
};

const copySharedGroup = async (req: AuthRequest, res: Response) => {
	const {
		params: { sharedGroupId },
		body: { sectionId }
	} = req;
	try {
		const sharedGroup = await SharedGroup.findOne({
			where: { id: sharedGroupId },
			include: { model: SharedCard, as: "sharedCards" },
		});
		if (!sharedGroup) {
			return res
				.status(404)
				.json({ error: true, message: "Shared group is not found" });
		} else if (!sharedGroup.sharedCards) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: "No cards to share"})
		}

		const existGroup = await Group.findOne({
			where: { sectionId, title: sharedGroup.title }
		});
		if (existGroup) {
			res
				.status(400)
				.json({ erorr: true, message: "You already have group with this name" });
			return;
		}

		const newGroup = await Group.create({
			title: sharedGroup.title,
			sectionId
		});
		if (sharedGroup.sharedCards.length > 0) {
			await Promise.all(
				sharedGroup.sharedCards.map(async (card) => {
					Card.create({
						word: card.word,
						translateWord: card.translateWord,
						groupId: newGroup.id,
					});
				}),
			);
		}

		res.status(StatusCodes.OK).json(newGroup);
	} catch (error) {
		sendError(res, error);
	}
};

export {
	createSharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
};
