import { StatusCodes } from "http-status-codes";

import { HttpError } from "@/libs/common/constants/HttpError.js";
import { type AuthRequestHandler } from "@/libs/common/types/AuthRequest.type.js";
import { Group } from "../models/Group.js";
import { Language } from "../models/Language.js";
import { Section } from "../models/Section.js";

const getAllSections: AuthRequestHandler = async (req, res) => {
  const userId = req.user.id;
  const sections = await Section.findAll({
    where: { userId },
    include: [{ model: Language, attributes: ["id", "title", "symbol"] }],
  });

  res.status(StatusCodes.OK).json(sections);
};

const addSection: AuthRequestHandler = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  if (data.title || data.languageId) {
    const existSection = await Section.findOne({
      where: {
        title: data.title ?? null,
        languageId: data.languageId ?? null,
        userId: userId,
      },
    });
    if (existSection) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: "Section already exists" });
    }
  }

  const newSection = (
    await Section.create({
      title: data.title || null,
      languageId: data.languageId || null,
      userId,
    })
  ).toJSON();
  if (data.languageId) {
    const section = await Section.findOne({
      where: {
        languageId: data.languageId || null,
        userId,
      },
      include: [{ model: Language, attributes: ["id", "title", "symbol"] }],
    });
    res.status(StatusCodes.OK).json(section);
    return;
  }
  res.status(StatusCodes.OK).json(newSection);
};

const updateSection: AuthRequestHandler = async (req, res) => {
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
};

const removeSection: AuthRequestHandler = async (req, res) => {
  const {
    user: { id: userId },
    params: { id },
  } = req;
  const sectionData = await Section.findOne({
    where: { id, userId },
  });
  if (!sectionData) {
    throw HttpError.notFound("Section not found");
  }
  const section = sectionData.toJSON();

  await Group.destroy({ where: { id: section.id } });
  await sectionData.destroy();
  res.status(StatusCodes.OK).json({ id: section.id });
};

export { getAllSections, addSection, updateSection, removeSection };
