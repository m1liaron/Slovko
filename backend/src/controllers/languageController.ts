import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendError } from "../helpers/sendError.js";
import { Language } from "../models/Language.js";

const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Language.findAll();

    res.status(StatusCodes.OK).json(languages);
  } catch (error) {
    sendError(res, error);
  }
};

export { getLanguages };
