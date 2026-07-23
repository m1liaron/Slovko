import { and, asc, between, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { users } from "@/modules/user";

import type {
  NewResultMode,
  NewWordResult} from "./libs";
import {
  ResultMode,
  resultModes,
  wordResults,
} from "./libs";

import type { NewResult} from "./index";
import { results } from "./index";



export const ResultRepository = {
  async findAllWithModesByUserId(userId: string) {
    return db.query.results.findMany({
      where: eq(results.userId, userId),
      with: {
        mode: {
          with: {
            words: true,
          },
        },
      },
    });
  },

  async findAndCountByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number,
    offset: number,
  ) {
    const where = and(
      eq(results.userId, userId),
      between(results.createdAt, startDate, endDate),
    );
    const [rows, count] = await Promise.all([
      db.query.results.findMany({
        where,
        orderBy: [desc(results.createdAt)],
        limit,
        offset,
      }),
      db.$count(results, where),
    ]);

    return { rows, count };
  },

  findEarliestByUserId(userId: string) {
    return db.query.results.findFirst({
      where: eq(results.userId, userId),
      orderBy: [asc(results.createdAt)],
      columns: { createdAt: true },
    });
  },

  findByIdWithModes(userId: string, resultId: string) {
    return db.query.results.findFirst({
      where: and(eq(results.userId, userId), eq(results.id, resultId)),
      with: {
        mode: {
          with: {
            words: true,
          },
        },
      },
    });
  },

  findByUserAndId(userId: string, resultId: string) {
    return db.query.results.findFirst({
      where: and(eq(results.userId, userId), eq(results.id, resultId)),
    });
  },

  async createResult(data: NewResult) {
    const [row] = await db.insert(results).values(data).returning();
    return row;
  },

  async createResultMode(data: NewResultMode) {
    const [row] = await db.insert(resultModes).values(data).returning();
    return row;
  },

  async createWordResult(data: NewWordResult) {
    const [row] = await db.insert(wordResults).values(data).returning();
    return row;
  },

  findUserById(id: string) {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },

  updatePoints(id: string, points: number) {
    return db.update(users).set({ points }).where(eq(users.id, id));
  },
};
