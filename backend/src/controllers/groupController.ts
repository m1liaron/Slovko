import { Card, Group } from "../models/models.js";
import { sequelize } from "../db/sequelize.js";
import { StatusCodes } from "http-status-codes";
import {
  AuthRequest,
  AuthRequestHandler,
} from "../common/types/AuthRequest.type.js";
import { Response } from "express";
import { sendError } from "../helpers/index.js";

const getAllGroups: AuthRequestHandler = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const groups = await Group.findAll({
      where: { sectionId },
    });

    res.status(StatusCodes.OK).json(groups);
  } catch (error) {
    sendError(res, error);
  }
};

const getGroup = async (req: AuthRequest, res: Response) => {
  const {
    params: { id },
    body: { sectionId },
  } = req;
  try {
    const group = await Group.findOne({
      where: { id, sectionId },
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
      group: ["Group.id"],
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
  const { title, sectionId } = req.body;
  try {
    const existGroup = await Group.findOne({
      where: {
        title: title,
        sectionId,
      },
    });
    if (existGroup) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: "Group already exists" });
    }
    const newGroup = (await Group.create({ title, sectionId })).toJSON();
    return res.status(StatusCodes.OK).json(newGroup);
  } catch (error) {
    sendError(res, error);
  }
};

const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    const {
      params: { id: groupId },
      body: { sectionId },
    } = req;
    const updatedGroup = await Group.update(req.body, {
      where: { id: groupId, sectionId },
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
      params: { id },
      body: { sectionId },
    } = req;
    const group = await Group.findOne({
      where: { id, sectionId },
    });
    if (!group) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: true, message: "Group not found" });
      return;
    }

    await Card.destroy({ where: { groupId: id } });
    await group.destroy();
    res.status(200).json({ id: group.id });
  } catch (error) {
    sendError(res, error);
  }
};

export { getAllGroups, getGroup, addGroup, removeGroup, updateGroup };
