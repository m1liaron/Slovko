import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthRequest } from "@/libs/types/auth-request.type.js";

import { UserService } from "./user.service";

const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUserWithStreakCheck(req.user.id);
    res.status(StatusCodes.OK).json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const user = await UserService.updateUser(userId, req.body);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUserStreak = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UserService.updateUserStreak(req.user.id);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
};

const getUserStreakDates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month, year } = req.query;
    const intMonth = Number(month);
    const intYear = Number(year);

    if (
      Number.isNaN(intMonth) ||
      Number.isNaN(intYear) ||
      intMonth < 1 ||
      intMonth > 12
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Invalid month or year",
      });
      return;
    }

    const streakDates = await UserService.getUserStreakDates(
      req.user.id,
      intMonth,
      intYear,
    );
    res.status(StatusCodes.OK).json(streakDates);
  } catch (err) {
    next(err);
  }
};

const buyFreeze = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { froze } = req.body;
    const user = await UserService.buyFreeze(req.user.id, froze);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export { getUser, updateUser, getUserStreakDates, updateUserStreak, buyFreeze };
