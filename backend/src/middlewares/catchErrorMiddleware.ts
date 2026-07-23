import { HttpError } from "@/libs/constants";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: "Validation failed",
      errors: error.issues.map((e) => ({
        path: e.path.slice(1).join("."),
        message: e.message,
      })),
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: true,
      message: error.message,
    });
    return;
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message });
};

export { errorMiddleware };
