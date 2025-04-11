const {
	SharedGroup,
	SharedCard,
	Group,
	Card,
	User,
} = require("../models/models");

const createSharedGroup = async (req, res) => {
	const {
		body: { groupId, title },
		user: { id },
	} = req;
	try {
		const group = await Group.findOne({
			where: { id: groupId },
			include: [
				{
					model: Card,
					as: "cards",
				},
				{
					model: User,
					as: "user",
					attributes: { exclude: ["password"] },
				},
			],
		});
		if (!group) {
			res.status(404).json({ error: true, message: "Group is not defined" });
		}
		const sharedGroup = await SharedGroup.create({
			title: title ? title : group.title,
			userId: id,
		});
		if (group.cards.length) {
			await Promise.all(
				group.cards.map(async (card) => {
					await SharedCard.create({
						word: card.word,
						translateWord: card.translateWord,
						sharedGroupId: sharedGroup.id,
					});
				}),
			);
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
		res.status(500).json({
			error: true,
			message: error.message || "Server Error. Try again later.",
		});
	}
};

const getAllSharedGroups = async (req, res) => {
	try {
		const {
			page,
			limit,
		} = req.query;
		const allSharedGroups = await SharedGroup.findAll({
			include: {
				model: User,
				as: "user",
				attributes: { exclude: ["password"] },
			},
		});

		const pageNumber = Number.parseInt(page, 10) || 1;
		const itemsPerPage = Number.parseInt(limit, 10) || 5;
		const skip = (pageNumber - 1 ) * itemsPerPage;
		const filteredSharedGroups = allSharedGroups.slice(skip, skip + itemsPerPage);
		const haveMoreSharedGroups = skip + itemsPerPage < allSharedGroups.length;

		res.status(200).json({ sharedGroups: filteredSharedGroups, haveMoreSharedGroups });
	} catch (error) {
		res.status(500).json({
			error: true,
			message: error.message || "Server Error. Try again later.",
		});
	}
};

const getSharedGroup = async (req, res) => {
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
		res.status(500).json({
			error: true,
			message: error.message || "Server Error. Try again later.",
		});
	}
};

const removeSharedGroup = async (req, res) => {
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
		res.status(500).json({
			error: true,
			message: error.message || "Server Error. Try again later.",
		});
	}
};

const copySharedGroup = async (req, res) => {
	const { sharedGroupId } = req.params;
	try {
		const sharedGroup = await SharedGroup.findOne({
			where: { id: sharedGroupId },
			include: { model: SharedCard, as: "sharedCards" },
		});
		if (!sharedGroup) {
			return res
				.status(404)
				.json({ error: true, message: "Shared group is not found" });
		}
		const newGroup = await Group.create({
			title: sharedGroup.title,
			userId: req.user.id,
		});
		if (sharedGroup.sharedCards.length) {
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

		res.status(200).json(newGroup);
	} catch (error) {
		res.status(500).json({
			error: true,
			message: error.message || "Server Error. Try again later.",
		});
	}
};

module.exports = {
	createSharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
};
