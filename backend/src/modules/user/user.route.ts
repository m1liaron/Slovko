import { authRouter } from "@/libs/modules/route/index.js";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware.js";
import { authMiddleware } from "@/middlewares/authenticationMiddleware.js";
import { validate } from "@/middlewares/index.js";
import { verifyOwnership } from "@/middlewares/verifyOwnership.middleware.js";
import {
  updateUserSchema,
  buyFreezeSchema,
  getUserStreakDatesSchema,
} from "./user.schema.js";

import {
  getUser,
  updateUser,
  updateUserStreak,
  buyFreeze,
  getUserStreakDates,
} from "./user.controller";

const { router, get, put, post, patch } = authRouter();

get("/me", authMiddleware, asyncHandler(getUser));
get(
  "/streak",
  authMiddleware,
  validate(getUserStreakDatesSchema),
  asyncHandler(getUserStreakDates),
);

patch(
  "/:id",
  authMiddleware,
  verifyOwnership("user"),
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

post("/streak", authMiddleware, asyncHandler(updateUserStreak));

put(
  "/streak/froze",
  authMiddleware,
  validate(buyFreezeSchema),
  asyncHandler(buyFreeze),
);

export { router as userRoute };
