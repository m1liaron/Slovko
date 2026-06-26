import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthRequest } from "@/libs/common/types/types";
import {
    SharedGroup,
    SharedCard,
    Group,
    Card,
    User,
} from "@";

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

    const groupData = await Group.findOne({
        where: { id: groupId },
        include: [
            {
                model: Card,
                as: "cards",
            },
        ],
    });
    const group = groupData?.toJSON();

    if (!group || !group.cards) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: true, message: "Group is not defined" });
    }
    if (group.cards.length === 0) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: true, message: "Group doesn't have cards to share" });
        return;
    }
    const sharedGroupData = await SharedGroup.create({
        title: title ? title : group.title,
        userId: id,
        isAnonymous,
        wordsLength: group.cards.length,
    });
    const sharedGroup = sharedGroupData.toJSON();
    await Promise.all(
        group.cards.map(async (card: Card) => {
            const word = card.word.trim();
            const translateWord = card.translateWord.trim();

            if (!word || !translateWord) return;
            if (word.length < 2 || translateWord.length < 2) return;

            await SharedCard.create({
                word: card.word,
                translateWord: card.translateWord,
                sharedGroupId: sharedGroup.id,
            });
        }),
    );

    const sharedGroupWithUser = await SharedGroup.findOne({
        where: { id: sharedGroup.id },
        include: {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "image"],
        },
    });

    res.status(200).json(sharedGroupWithUser);
};

const getAllSharedGroups = async (
    req: AuthRequest<SharedGroupsQuery>,
    res: Response,
) => {
    const { page = "0", limit = "10" } = req.query as SharedGroupsQuery;
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

    res
        .status(200)
        .json({ sharedGroups: filteredSharedGroups, haveMoreSharedGroups });
};

const getSharedGroup = async (req: Request, res: Response) => {
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
};

const removeSharedGroup = async (req: AuthRequest, res: Response) => {
    const sharedId = req.params.sharedGroupId;
    const sharedGroup = await SharedGroup.findOne({
        where: { id: sharedId, userId: req.user.id },
    });
    const sharedGroupData = sharedGroup?.toJSON();
    if (!sharedGroupData) {
        return res.status(404).json({ error: true, message: "Group not found" });
    }
    const { id: sharedGroupId } = sharedGroupData;
    if (sharedGroupData.userId !== req.user.id) {
        res
            .status(400)
            .json({ error: true, message: "You are not owner of this group!" });
    }

    await sharedGroup?.destroy();

    res.status(200).json(sharedGroupId);
};

const copySharedGroup = async (req: AuthRequest, res: Response) => {
    const {
        params: { sharedGroupId },
        body: { sectionId },
    } = req;

    const sharedGroupData = await SharedGroup.findOne({
        where: { id: sharedGroupId },
        include: { model: SharedCard, as: "sharedCards" },
    });
    const sharedGroup = sharedGroupData?.get({ plain: true });
    if (!sharedGroup) {
        return res
            .status(404)
            .json({ error: true, message: "Shared group is not found" });
    } else if (!sharedGroup.sharedCards) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: true, message: "No cards to share" });
    }

    if (sectionId.length > 0) {
        const existGroupData = await Group.findOne({
            where: { sectionId, title: sharedGroup.title },
        });
        const existGroup = existGroupData?.toJSON();
        if (existGroup) {
            res.status(400).json({
                erorr: true,
                message: "You already have group with this name",
            });
            return;
        }
    }

    const newGroupData = await Group.create({
        title: sharedGroup.title,
        sectionId,
    });
    const newGroup = newGroupData?.toJSON();

    if (sharedGroup.sharedCards.length > 0) {
        console.log("Shared cards to copy: ", sharedGroup.sharedCards);
        await Promise.all(
            sharedGroup.sharedCards.map(async (card: Card) => {
                const word = card.word.trim();
                const translateWord = card.translateWord.trim();

                if (!word || !translateWord) return;
                if (word.length < 2 || translateWord.length < 2) return;

                Card.create({
                    word: card.word,
                    translateWord: card.translateWord,
                    groupId: newGroup.id,
                });
            }),
        );
    }

    res.status(StatusCodes.OK).json(newGroup);
};

export {
    createSharedGroup,
    getAllSharedGroups,
    getSharedGroup,
    copySharedGroup,
    removeSharedGroup,
};
