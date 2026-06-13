import {
  register,
  login,
  getUser,
  updateUser,
  updateUserStreak,
  buyFreeze,
  getUserStreakDates,
} from "../controllers/userController.js";
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
} from "../schemas/user.schema.js";

import { authRouter } from "./authRoute.js";

const { router, get, put, post, patch } = authRouter();

router.route("/register").post(validate(registerSchema), register);
router.route("/login").post(validate(loginSchema), login);

get("/", authMiddleware, getUser);

patch(
  "/:userId",
  authMiddleware,
  verifyOwnership("user", { Model: User }),
  validate(updateUserSchema),
  updateUser,
);

get("/streak", authMiddleware, getUserStreakDates);

post(
  "/streak",
  authMiddleware,
  validate(updateUserStreakSchema),
  updateUserStreak,
);

put("/streak/froze", authMiddleware, validate(buyFreezeSchema), buyFreeze);

export { router as userRoute };
