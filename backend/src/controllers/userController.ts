import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { Streak, User } from "../models/models.js";
import { AuthRequest } from "../common/types/AuthRequest.type.js";
import { sendError } from "../helpers/index.js";

const register = async (req: Request, res: Response) => {
	try {
		const { email, password, name } = req.body;
		if (!email || !password || !name) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: true,
				message: "Please provide name, email, and password",
			});
		}

		const findUser = await User.findOne({ where: { email } });
		if (findUser) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "User already exist" });
		}

		const user = await User.create({
			email,
			password,
			name,
		});
		const token = user.createJWT();
		const { password: uselessPassword, ...mainUserData } = user.toJSON(); // or dataValues
		res.status(StatusCodes.CREATED).json({ user: mainUserData, token });
	} catch (error) {
		sendError(res, error);
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const { email, password: requestPassword } = req.body;
		if (!email || !requestPassword) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "Please provide email and password" });
		}

		const user = await User.findOne({
			where: { email },
		});
		if (!user) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ error: true, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcrypt.compare(
			requestPassword,
			user.password,
		);
		if (!isPasswordCorrect) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ error: true, message: "Invalid credentials" });
		}

		const token = user.createJWT();
		const { password: uselessPassword, ...mainUserData } = user.toJSON();
		res.status(StatusCodes.OK).json({ user: mainUserData, token });
	} catch (error) {
		sendError(res, error);
	}
};

const getUser = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user.id;
		const user = await User.findOne({
			where: { id: userId },
		});

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: true, message: "User does not exist" });
		}

		if (user.lastReviewAt) {
			// If user is existed, check his streak
			const lastReviewDate = user.lastReviewAt
				? new Date(user.lastReviewAt)
				: null;
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const timeGone =
				!lastReviewDate || lastReviewDate.getTime() !== today.getTime();
			const goneTwoOrMoreDays = lastReviewDate ? new Date(lastReviewDate).getDate() <= (new Date().getDate() - 2) : null;


			if (timeGone && !user.frozen || goneTwoOrMoreDays) {
				user.streak = 1;
				await Streak.create({
					date: new Date(),
					frozen: false,
					userId: userId,
				});
			} else if (timeGone && user.frozen) {
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);

				user.frozen = false;
				await Streak.create({
					date: yesterday,
					frozen: true,
					userId: userId,
				});
			}

			user.lastReviewAt = today;
			await user.save();
		}

		const { password, ...mainUserData } = user.dataValues;
		res.status(200).json({ user: mainUserData });
	} catch (error) {
		sendError(res, error);
	}
};

const updateUser = async (req: Request, res: Response) => {
	const {
		params: { userId },
		body,
	} = req;
	try {
		if (body.image === "") {
			body.image = "";
		}

		const [count, users] = await User.update(body, {
			where: { id: userId },
			returning: true,
		});


		if (!users.length) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: true, message: "User does not found" });
		}

		const userObject = users[0].get();
		const { password, ...userWithoutPassword } = userObject;
		res.status(200).json(userWithoutPassword);
	} catch (error) {
		sendError(res, error);
	}
};

const updateUserStreak = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.user;
		const user = await User.findByPk(id);
		if (user) {
			const isUserFrozen = user.frozen;
			const lastReviewDate = user.lastReviewAt
				? new Date(user.lastReviewAt)
				: null;
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (
				lastReviewDate &&
				lastReviewDate.getTime() === today.getTime() - 86400000
			) {
				// 86400000 ms in a day
				user.streak += 1;
			} else if (
				!lastReviewDate ||
				(lastReviewDate.getTime() !== today.getTime() && user.frozen)
			) {
				user.frozen = false;
			} else if (
				!lastReviewDate ||
				(lastReviewDate.getTime() !== today.getTime() && !user.frozen)
			) {
				user.streak = 1;
			}
			await Streak.create({
				date: new Date(),
				frozen: isUserFrozen,
				userId: id,
			});

			user.lastReviewAt = today; // Update last review date
			await user.save();
		}

		const findUser = await User.findOne({
			where: { id },
			include: [
				{
					model: Streak,
					as: "streakDates",
					attributes: ["id", "date", "createdAt", "updatedAt"],
				},
			],
		});

		if (!findUser) {
			res.status(StatusCodes.NOT_FOUND).json({ error: true, message: "User not found" });
			return;
		}

		const { password: uselessPassword, ...mainUserData } = findUser.dataValues;
		res.status(200).json(mainUserData);
	} catch (error) {
		sendError(res, error);
	}
};

const getUserStreakDates = async (req: AuthRequest, res: Response) => {
	const { month, year } = req.query;
	try {
		if (!month || !year) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "Month and year are required." });
		}

		const intMonth = Number.parseInt(String(month), 10);
		const intYear = Number.parseInt(String(year), 10);
		if (
			Number.isNaN(intMonth) ||
			Number.isNaN(intYear) ||
			intMonth < 1 ||
			intMonth > 12
		) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "Invalid month or year" });
		}

		const startDate = new Date(intYear, intMonth - 1, 1); // Month is 0-indexed in JavaScript Date
		const endDate = new Date(intYear, intMonth, 0, 23, 59, 59, 999); // Last day of the month

		const streakDates = await Streak.findAll({
			where: {
				userId: req.user.id,
				date: { [Op.between]: [startDate, endDate] },
			},
		});
		res.status(StatusCodes.OK).json(streakDates);
	} catch (error) {
		sendError(res, error);
	}
};

const buyFreeze = async (req: AuthRequest, res: Response) => {
	// body scheme { froze: 100 }, 100 is points cost
	try {
		const {
			user: { id },
			body: { froze },
		} = req;

		const user = await User.findByPk(id);
		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: true, message: "User not found" });
		}
		if (user.points < froze) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: true,
				message: `You don't have points to buy freeze, you need more: ${froze - user.points} points`,
			});
		}
		if (user.frozen) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: true, message: "You already have freeze" });
		}
		await user.update({
			points: user.points - froze,
			frozen: true,
		});

		res.status(StatusCodes.OK).json(user);
	} catch (error) {
		sendError(res, error);
	}
};

export {
	register,
	getUser,
	login,
	updateUser,
	getUserStreakDates,
	updateUserStreak,
	buyFreeze,
};
