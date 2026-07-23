import { Op } from "sequelize";

import { Result, ResultMode, WordResult, User } from "@/models/models.js";

export const ResultRepository = {
  findAllWithModesByUserId(userId: string) {
    return Result.findAll({
      where: { userId },
      include: [
        {
          model: ResultMode,
          as: "mode",
          include: [{ model: WordResult, as: "words" }],
        },
      ],
    });
  },

  findAndCountByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number,
    offset: number,
  ) {
    return Result.findAndCountAll({
      where: {
        userId,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  },

  findEarliestByUserId(userId: string) {
    return Result.findOne({
      where: { userId },
      order: [["createdAt", "ASC"]],
      attributes: ["createdAt"],
    });
  },

  findByIdWithModes(userId: string, resultId: string) {
    return Result.findOne({
      where: { userId, id: resultId },
      include: {
        model: ResultMode,
        as: "mode",
        include: [{ model: WordResult, as: "words" }],
      },
    });
  },

  findByUserAndId(userId: string, resultId: string) {
    return Result.findOne({ where: { userId, id: resultId } });
  },

  createResult(data: {
    title: string | Date;
    userId: string;
    startedLearn: Date;
    completionTime: Date;
  }) {
    return Result.create(data);
  },

  createResultMode(data: { mode: string; resultId: string }) {
    return ResultMode.create(data);
  },

  createWordResult(data: {
    word: string;
    translate: string;
    mistakesAmount: number;
    resultModeId: string;
  }) {
    return WordResult.create(data);
  },

  findUserById(id: string) {
    return User.findByPk(id);
  },

  updatePoints(id: string, points: number) {
    return User.update({ points }, { where: { id } });
  },
};
