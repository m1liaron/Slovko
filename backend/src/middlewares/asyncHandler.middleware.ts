import type { RequestHandler } from "express";

import type { AuthRequestHandler } from "../common/types/AuthRequest.type.js";

const asyncHandler =
  (fn: AuthRequestHandler | RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve((fn as RequestHandler)(req, res, next)).catch(next);
  };

export { asyncHandler };
