import {
  register,
  login,
  getUser,
  updateUser,
  updateUserStreak,
  buyFreeze,
  getUserStreakDates,
} from "../controllers/userController.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";
import { validate } from "../middlewares/index.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { User } from "../models/User.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  updateUserStreakSchema,
  buyFreezeSchema,
  getUserStreakDatesSchema,
} from "../schemas/user.schema.js";

import { authRouter } from "./authRoute.js";

const { router, get, put, post, patch } = authRouter();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

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
  verifyOwnership("user", { Model: User }),
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

post(
  "/streak",
  authMiddleware,
  validate(updateUserStreakSchema),
  asyncHandler(updateUserStreak),
);

put(
  "/streak/froze",
  authMiddleware,
  validate(buyFreezeSchema),
  asyncHandler(buyFreeze),
);

export { router as userRoute };
