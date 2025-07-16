import { authRouter } from "./authRouter";
const { router, get, put, patch } = authRouter();
import {
	register,
	login,
	getUser,
	updateUser,
	updateUserStreak,
	buyFreeze,
	getUserStreakDates,
}  from "../controllers/userController";
import { authMiddleware } from "../middlewares/authenticationMiddleware";

router.route("/register").post(register);
router.route("/login").post(login);

get("/", authMiddleware, getUser);
patch("/:userId", authMiddleware, updateUser);
get("/streak", authMiddleware, getUserStreakDates);
patch("/streak", authMiddleware, updateUserStreak);
put("/streak/froze", authMiddleware, buyFreeze);

export { router as userRoute }
