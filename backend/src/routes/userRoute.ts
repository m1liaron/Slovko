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

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

get("/", authMiddleware, getUser);

patch(
  "/:userId",
  authMiddleware,
  verifyOwnership("user", { Model: User }),
  updateUser,
);

get("/streak", authMiddleware, getUserStreakDates);

post("/streak", authMiddleware, updateUserStreak);

put("/streak/froze", authMiddleware, buyFreeze);

export { router as userRoute };
