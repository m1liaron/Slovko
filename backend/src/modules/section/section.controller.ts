import { StatusCodes } from "http-status-codes";

import type { AuthRequestHandler } from "@/libs/types/auth-request.type.js";

import { SectionService } from "./section.service.js";

const getAllSections: AuthRequestHandler = async (req, res) => {
  const sections = await SectionService.getAllSections(req.user.id);
  res.status(StatusCodes.OK).json(sections);
};

const addSection: AuthRequestHandler = async (req, res) => {
  const section = await SectionService.addSection(req.user.id, req.body);
  res.status(StatusCodes.OK).json(section);
};

const updateSection: AuthRequestHandler = async (req, res) => {
  const section = await SectionService.updateSection(
    req.params.id,
    req.user.id,
    req.body,
  );
  res.status(StatusCodes.OK).json(section);
};

const removeSection: AuthRequestHandler = async (req, res) => {
  const result = await SectionService.removeSection(req.params.id, req.user.id);
  res.status(StatusCodes.OK).json(result);
};

export { getAllSections, addSection, updateSection, removeSection };
