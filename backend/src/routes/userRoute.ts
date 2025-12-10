import { authRouter } from "./authRoute.js";

const { router, get, put, post, patch } = authRouter();
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

router.route("/register").post(register);
router.route("/login").post(login);

get("/", authMiddleware, getUser);
patch("/:userId", authMiddleware, updateUser);
get("/streak", authMiddleware, getUserStreakDates);
post("/streak", authMiddleware, updateUserStreak);
put("/streak/froze", authMiddleware, buyFreeze);

export { router as userRoute };
