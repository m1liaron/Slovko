import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { db } from "@/db/drizzle";

const getLanguages = async (_req: Request, res: Response) => {
    const languagesData = await db.query.languages.findAll;
    res.status(StatusCodes.OK).json(languagesData);
};

export { getLanguages };
