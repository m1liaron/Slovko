import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import { HttpError } from "../common/constants/HttpError.js";
import type { AuthRequest } from "../common/types/AuthRequest.type.js";
import { Streak, User } from "../models/models.js";

const MILLISECONDS_IN_DAY = 86400000;

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setMinutes(0, 0, 0);
  x.setSeconds(0, 0);
  x.setMilliseconds(0);
  return x;
};

const register = async (req: Request, res: Response) => {
  const { email, password, name, points } = req.body;

  const findUser = await User.findOne({ where: { email } });
  if (findUser) {
    throw HttpError.badRequest("User already exist");
  }

  const user = await User.create({
    email,
    password,
    name,
    points,
  });
  const token = user.createJWT();
  const mainUserData = user.toJSON();
  res.status(StatusCodes.CREATED).json({ user: mainUserData, token });
};

const login = async (req: Request, res: Response) => {
  const { email, password: requestPassword } = req.body;

  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: true, message: "User with this email not found" });
  }

  const isPasswordCorrect = await user.comparePassword(requestPassword);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: true, message: "Invalid credentials" });
  }

  const token = user.createJWT();
  const mainUserData = user.toJSON();
  res.status(StatusCodes.OK).json({ user: mainUserData, token });
};

const getUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const user = await User.findOne({
    where: { id: userId },
  });

  if (!user) {
    return HttpError.notFound("User does not exist");
  }

  // If user is existed, check his streak
  const today = startOfDay(new Date());

  if (user.lastReviewAt) {
    const lastReviewDate = startOfDay(new Date(user.lastReviewAt));
    const diffDays = Math.round(
      (today.getTime() - lastReviewDate.getTime()) / MILLISECONDS_IN_DAY,
    );

    if (diffDays === 2) {
      if (user.frozen) {
        const yesterday = startOfDay(new Date());
        yesterday.setDate(yesterday.getDate() - 1);

        const existing = await Streak.findOne({
          where: {
            userId: user.id,
            date: yesterday,
          },
        });

        if (!existing) {
          await Streak.create({
            date: yesterday,
            frozen: true,
            userId: user.id,
          });
        }
      } else {
        user.streak = 1;
        await user.save();
      }
    } else if (diffDays >= 3) {
      if (user.streak !== 1 || user.frozen !== false) {
        user.streak = 1;
        user.frozen = false;
        await user.save();
      }
    }

    user.lastReviewAt = today;
    user.save();
  }

  const mainUserData = user.toJSON();
  res.status(StatusCodes.OK).json({ user: mainUserData });
};

const updateUser = async (req: Request, res: Response) => {
  const {
    params: { id: userId },
    body,
  } = req;
  const [count, users] = await User.update(body, {
    where: { id: userId },
    returning: true,
  });

  if (!count) {
    throw HttpError.notFound("User not found");
  }

  const mainUserData = users[0].toJSON();
  res.status(StatusCodes.OK).json(mainUserData);
};

const updateUserStreak = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  const today = startOfDay(new Date());
  const last = user.lastReviewAt ? new Date(user.lastReviewAt) : null;
  const isUserFrozen = user.frozen;

  let diffDays = Infinity;

  if (last) {
    diffDays = Math.round(
      (today.getTime() - last.getTime()) / MILLISECONDS_IN_DAY,
    );
  }

  if (!last) {
    // first ever review
    user.streak = 1;
  } else if (diffDays === 1) {
    user.streak = (user.streak || 0) + 1;
  } else if (diffDays === 2) {
    if (user.frozen) {
      user.frozen = false; // freeze consumed
    } else {
      user.streak = 1;
    }
  } else {
    // missed 2+ days
    user.streak = 1;
    user.frozen = false;
  }

  await Streak.create({
    date: new Date(),
    frozen: isUserFrozen,
    userId: id,
  });

  user.lastReviewAt = today; // Update last review date
  await user.save();

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
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: true, message: "User not found" });
    return;
  }

  const mainUserData = findUser.toJSON();
  res.status(200).json(mainUserData);
};

const getUserStreakDates = async (req: AuthRequest, res: Response) => {
  const { month, year } = req.query;

  const intMonth = Number(month);
  const intYear = Number(year);
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
};

const buyFreeze = async (req: AuthRequest, res: Response) => {
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
    throw HttpError.badRequest(
      `You need more: ${froze - user.points} points to buy freeze`,
    );
  }
  if (user.frozen) {
    throw HttpError.badRequest("You already have freeze");
  }
  await user.update({
    points: user.points - froze,
    frozen: true,
  });

  const mainUserData = user.toJSON();
  res.status(StatusCodes.OK).json(mainUserData);
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
