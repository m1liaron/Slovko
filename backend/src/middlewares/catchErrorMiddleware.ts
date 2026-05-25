import type { Request, Response, NextFunction } from "express";

import { sendError } from "../helpers/sendError.js";

const handleErrorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    next();
  } catch (error) {
    sendError(res, error);
  }
};

export { handleErrorsMiddleware };
