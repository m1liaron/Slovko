import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { HttpError } from "../common/constants/HttpError.js";
import { EnvVariables } from "../common/enums/index.js";
import { User } from "../models/User.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
  };
}

interface DecodedUserPayload extends JwtPayload {
  userId: string;
  name: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return HttpError.unauthorized("Authentication invalid, user not found");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      EnvVariables.JWT_SECRET!,
    ) as DecodedUserPayload;
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return HttpError.unauthorized("Authentication invalid, user not found");
    }
    req.user = { id: decoded.userId, name: decoded.name };

    next();
  } catch (error) {
    if (error instanceof Error) {
      return HttpError.unauthorized(
        "Authentication invalid, user not found: " + error.message,
      );
    }
  }
};

export { authMiddleware };
