import { AuthRequestHandler } from "@/libs/types/auth-request.type";
import type { RequestHandler } from "express";


const asyncHandler =
  (fn: AuthRequestHandler | RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve((fn as RequestHandler)(req, res, next)).catch(next);
  };

export { asyncHandler };
