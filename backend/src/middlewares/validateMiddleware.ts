import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            path: e.path.slice(1).join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };

export { validate };
