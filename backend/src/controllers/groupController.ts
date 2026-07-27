import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { literal } from "sequelize";

import { HttpError } from "../common/constants/HttpError.js";
import type {
  AuthRequest,
  AuthRequestHandler,
} from "../common/types/AuthRequest.type.js";
import { sequelize } from "../db/sequelize.js";
import { Card, Group } from "../models/models.js";

const getAllGroups: AuthRequestHandler = async (req, res) => {
  const { sectionId } = req.params;

  const groups = await Group.findAll({
    where: { sectionId },
    attributes: {
      include: [
        [
          literal(`(
            SELECT COUNT(*)
            FROM "Cards" AS c
            WHERE c."groupId" = "Group"."id" and c."status" = 'To Learn'  
          )`),
          "toLearnCount",
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM "Cards" AS c
            WHERE c."groupId" = "Group"."id" and c."status" = 'Repeated'  
          )`),
          "repeatedCount",
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM "Cards" AS c
            WHERE c."groupId" = "Group"."id" and c."status" = 'Know' 
          )`),
          "knowCount",
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM "Cards" AS c
            WHERE c."groupId" = "Group"."id" and c."status" = 'Learned'
          )`),
          "learnedCount",
        ],
      ],
    },
  });
  res.status(StatusCodes.OK).json(groups);
};

const getGroup = async (req: AuthRequest, res: Response) => {
  const {
    params: { id: groupId },
  } = req;

  const group = await Group.findOne({
    where: { id: groupId },
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
            sequelize.literal(`CASE WHEN cards.status = 'To Learn' THEN 1 END`),
          ),
          "learnToCardsAmount",
        ],
        // Calculate the count of cards with 'Learned' status
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN cards.status = 'Learned' THEN 1 END`),
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
    group: ["Group.id"],
    subQuery: false, // Necessary for aggregation queries with associations
  });
  if (!group) {
    throw HttpError.notFound("Group does not exist");
  }

  res.status(200).json(group);
};

const addGroup = async (req: AuthRequest, res: Response) => {
  const { title, sectionId } = req.body;

  const existGroup = await Group.findOne({
    where: {
      title: title,
      sectionId,
    },
  });
  if (existGroup) {
    throw HttpError.badRequest("Group already exists");
  }
  const newGroup = (await Group.create({ title, sectionId })).toJSON();
  return res.status(StatusCodes.OK).json(newGroup);
};

const updateGroup = async (req: AuthRequest, res: Response) => {
  const {
    params: { id: groupId },
    body: { sectionId },
  } = req;
  const updatedGroup = await Group.update(req.body, {
    where: { id: groupId, sectionId },
    returning: true,
  });

  if (updatedGroup[0] === 0) {
    throw HttpError.notFound("Group not found");
  }

  const group = await Group.findOne({
    where: { id: groupId },
  });

  res.status(StatusCodes.OK).json(group);
};

const removeGroup = async (req: AuthRequest, res: Response) => {
  const {
    params: { id: groupId },
  } = req;
  const group = await Group.findOne({
    where: { id: groupId },
  });
  if (!group) {
    throw HttpError.notFound("Group not found");
  }

  await Card.destroy({ where: { groupId: groupId } });
  await group.destroy();

  res.status(StatusCodes.OK).json({ id: groupId });
};

const moveGroupToAnotherSection: AuthRequestHandler = async (req, res) => {
  const {
    params: { id: groupId },
    body: { sectionId },
  } = req;

  const updatedGroup = await Group.update(
    { sectionId },
    {
      where: {
        id: groupId,
      },
    },
  );
  if (updatedGroup[0] === 0) {
    throw HttpError.notFound("Group not found");
  }

  const group = await Group.findOne({
    where: { id: groupId, sectionId },
  });

  res.status(StatusCodes.OK).json(group);
};

export {
  getAllGroups,
  getGroup,
  addGroup,
  removeGroup,
  updateGroup,
  moveGroupToAnotherSection,
};
