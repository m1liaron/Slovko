import type { NextFunction, Response } from "express";

import { User } from "../models/User.js";

import { asyncHandler } from "./asyncHandler.middleware.js";
import { HttpError } from "@/libs/constants/index.js";
import { AuthRequest } from "@/libs/types/auth-request.type.js";
import { jwtToken } from "@/libs/modules/token/token.js";

const authMiddleware = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw HttpError.unauthorized("Authentication invalid, user not found");
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = await jwtToken.verifyJWTToken(token);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        throw HttpError.unauthorized("Authentication invalid, user not found");
      }
      req.user = { id: decoded.id, name: decoded.name };

      next();
    } catch (error) {
      if (error instanceof Error) {
        throw HttpError.unauthorized(
          "Authentication invalid, user not found: " + error.message,
        );
      }
    }
  },
);

export { authMiddleware };
