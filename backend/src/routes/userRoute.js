const express = require("express");
const router = express.Router();
const {
	register,
	login,
	getUser,
	updateUser,
	updateUserStreak,
	buyFreeze,
	getUserStreakDates,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authenticationMiddleware");

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/", authMiddleware, getUser);
router.put("/:userId", authMiddleware, updateUser);
router.get("/streak", authMiddleware, getUserStreakDates);
router.patch("/streak", authMiddleware, updateUserStreak);
router.put("/streak/froze", authMiddleware, buyFreeze);

module.exports = router;
