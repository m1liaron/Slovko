import { StatusCodes } from "http-status-codes";
import { AuthRequestHandler } from "../common/types/AuthRequest.type.js";
import { sendError } from "../helpers/sendError.js";
import { Section } from "../models/Section.js";
import { Group } from "../models/Group.js";
import { Language } from "../models/Language.js";

const getAllSections: AuthRequestHandler = async (req, res) => {
  const userId = req.user.id;
  try {
    const sections = await Section.findAll({
      where: { userId },
      include: [{ model: Language, attributes: ["id", "title", "symbol"] }],
    });

    res.status(StatusCodes.OK).json(sections);
  } catch (error) {
    sendError(res, error);
  }
};

const addSection: AuthRequestHandler = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  try {
    const existSection = await Section.findOne({
      where: {
        title: data.title ?? null,
        userId: userId,
      },
    });
    if (existSection) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: "Section already exists" });
    }
    const newSection = (
      await Section.create({
        title: data.title || null,
        languageId: data.languageId || null,
        userId,
      })
    ).toJSON();
    res.status(StatusCodes.OK).json(newSection);
  } catch (error) {
    sendError(res, error);
  }
};

const updateSection: AuthRequestHandler = async (req, res) => {
  try {
    const {
      params: { id: sectionId },
      user: { id: userId },
    } = req;
    const updatedSection = await Section.update(req.body, {
      where: { id: sectionId, userId },
      returning: true,
    });

    if (updatedSection[0] === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: true, message: "Section not found" });
    }

    const section = await Section.findOne({
      where: { id: sectionId },
    });

    res.status(StatusCodes.OK).json(section);
  } catch (error) {
    sendError(res, error);
  }
};

const removeSection: AuthRequestHandler = async (req, res) => {
  try {
    const {
      user: { id: userId },
      params: { id },
    } = req;
    const section = await Section.findOne({
      where: { id, userId },
    });
    if (!section) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: true, message: "Section not found" });
      return;
    }

    await Group.destroy({ where: { id: section.id } });
    await section.destroy();
    res.status(StatusCodes.OK).json({ id: section.id });
  } catch (error) {
    sendError(res, error);
  }
};

export { getAllSections, addSection, updateSection, removeSection };
