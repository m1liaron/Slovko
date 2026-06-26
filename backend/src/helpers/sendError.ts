import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

const sendError = (res: Response, error: any) => {
  if (error instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: true,
      message: error.message || "Error get repeated cards",
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: true,
      message: error.message || "Error get repeated cards",
    });
  }
};

export { sendError };
