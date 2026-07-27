import { HttpError } from "@/libs/constants";
import { encrypt } from "@/libs/modules/encrypt";
import { StreakRepository } from "@/modules/streak/index";

import { type User, type NewUser } from "./user.model";
import { UserRepository } from "./user.repository";

const MILLISECONDS_IN_DAY = 86400000;

const startOfDay = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const daysBetween = (from: Date, to: Date): number =>
  Math.round((to.getTime() - from.getTime()) / MILLISECONDS_IN_DAY);

const UserService = {
  async createUser(input: NewUser): Promise<User> {
    if (!input.password) {
      throw HttpError.badRequest("Password is required");
    }

    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      throw HttpError.badRequest("Email already in use");
    }

    const hashed = await encrypt.hash(input.password);

    return UserRepository.create({ ...input, password: hashed });
  },

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await UserRepository.findByEmail(email);
  },

  async findUserById(id: string): Promise<User | undefined> {
    return UserRepository.findById(id);
  },

  /**
   * Loads a user and, if they have a lastReviewAt, reconciles their streak
   * against the number of days that have passed (freeze consumption,
   * streak resets, etc.), then returns the up-to-date user.
   */
  async getUserWithStreakCheck(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw HttpError.notFound("User does not exist");
    }

    if (user.lastReviewAt) {
      const today = startOfDay(new Date());
      const lastReviewDate = startOfDay(new Date(user.lastReviewAt));
      const diffDays = daysBetween(lastReviewDate, today);

      if (diffDays === 2) {
        if (user.frozen) {
          const yesterday = startOfDay(new Date());
          yesterday.setDate(yesterday.getDate() - 1);

          const existing = await StreakRepository.findOneByUserAndDate(
            userId,
            yesterday,
          );

          if (!existing) {
            await StreakRepository.create({
              date: yesterday,
              frozen: true,
              userId,
            });
          }
        } else {
          await UserRepository.update(userId, { streak: 1 });
        }
      } else if (diffDays >= 3) {
        if (user.streak !== 1 || user.frozen !== false) {
          await UserRepository.update(userId, {
            streak: 1,
            frozen: false,
          });
        }
      }

      await UserRepository.update(userId, { lastReviewAt: today });
    }

    return UserRepository.findById(userId);
  },

  async updateUser(userId: string, data: Record<string, unknown>) {
    const user = await UserRepository.update(userId, data);
    if (!user) {
      throw HttpError.notFound("User not found");
    }
    return user;
  },

  /**
   * Records today's review, advances/resets the streak, and returns the
   * user together with their streak history.
   */
  async updateUserStreak(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw HttpError.notFound("User not found");
    }

    const today = startOfDay(new Date());
    const last = user.lastReviewAt ? new Date(user.lastReviewAt) : null;
    const isUserFrozen = user.frozen;

    const diffDays = last ? daysBetween(startOfDay(last), today) : Infinity;

    const updates: { streak?: number; frozen?: boolean; lastReviewAt: Date } = {
      lastReviewAt: today,
    };

    if (!last) {
      // first ever review
      updates.streak = 1;
    } else if (diffDays === 1) {
      updates.streak = (user.streak || 0) + 1;
    } else if (diffDays === 2) {
      if (user.frozen) {
        updates.frozen = false; // freeze consumed
      } else {
        updates.streak = 1;
      }
    } else {
      // missed 2+ days
      updates.streak = 1;
      updates.frozen = false;
    }

    await StreakRepository.create({
      date: new Date(),
      frozen: isUserFrozen,
      userId,
    });

    const updatedUser = await UserRepository.update(userId, updates);
    if (!updatedUser) {
      throw HttpError.notFound("User not found");
    }

    const streakDates =
      await StreakRepository.findAllByUserWithSelectedFields(userId);

    return { ...updatedUser, streakDates };
  },

  async getUserStreakDates(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1); // month is 0-indexed
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // last day of month

    return StreakRepository.findAllByUserAndDateRange(
      userId,
      startDate,
      endDate,
    );
  },

  async buyFreeze(userId: string, froze: number) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw HttpError.notFound("User not found");
    }
    if (user.points < froze) {
      throw HttpError.badRequest(
        `You need more: ${froze - user.points} points to buy freeze`,
      );
    }
    if (user.frozen) {
      throw HttpError.badRequest("You already have freeze");
    }

    return UserRepository.update(userId, {
      points: user.points - froze,
      frozen: true,
    });
  },
};
export { UserService };
