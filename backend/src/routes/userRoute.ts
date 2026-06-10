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
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { User } from "../models/User.js";

import { authRouter } from "./authRoute.js";

const { router, get, put, post, patch } = authRouter();

router.route("/register").post(register);
router.route("/login").post(login);

get("/", authMiddleware, getUser);
patch(
  "/:userId",
  authMiddleware,
  verifyOwnership("user", {
    Model: User,
  }),
  updateUser,
);
get("/streak", authMiddleware, getUserStreakDates);
post("/streak", authMiddleware, updateUserStreak);
put("/streak/froze", authMiddleware, buyFreeze);

export { router as userRoute };
