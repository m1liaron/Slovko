import { authRouter } from "./authRouter";
const { router, get, post, patch, remove } = authRouter();
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
router.get("/", authMiddleware, getUser);
router.put("/:userId", authMiddleware, updateUser);
router.get("/streak", authMiddleware, getUserStreakDates);
router.patch("/streak", authMiddleware, updateUserStreak);
router.put("/streak/froze", authMiddleware, buyFreeze);

export { router as userRoute }
