import { and, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  users,
  groups,
  cards,
  sharedGroups,
  sharedCards,
} from "@/modules/index";

import type { NewGroup } from "../group";

const userColumnsWithoutPassword = {
  id: true,
  name: true,
  email: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  frozen: true,
}

const SharedGroupRepository = {
  findGroupWithCards(groupId: string) {
    return db.query.groups.findFirst({
      where: eq(groups.id, groupId),
      with: { cards: true },
    });
  },

  async createSharedGroup(data: {
    title: string;
    userId: string;
    isAnonymous: boolean;
    wordsLength: number;
  }) {
    const [row] = await db.insert(sharedGroups).values(data).returning();
    return row;
  },

  async createSharedCard(data: {
    word: string;
    translateWord: string;
    sharedGroupId: string;
  }) {
    const [row] = await db.insert(sharedCards).values(data).returning();
    return row;
  },

  findByIdWithUser(sharedGroupId: string) {
    return db.query.sharedGroups.findFirst({
      where: eq(sharedGroups.id, sharedGroupId),
      with: {
        user: {
          columns: { id: true, name: true, email: true, image: true },
        },
      },
    });
  },

  findAllWithUser() {
    return db.query.sharedGroups.findMany({
      with: {
        user: {
          columns: userColumnsWithoutPassword,
        },
      },
    });
  },

  findByIdWithCardsAndUser(sharedGroupId: string) {
    return db.query.sharedGroups.findFirst({
      where: eq(sharedGroups.id, sharedGroupId),
      with: {
        sharedCards: true,
        user: {
          columns: userColumnsWithoutPassword,
        },
      },
    });
  },

  findByIdAndUserId(sharedGroupId: string, userId: string) {
    return db.query.sharedGroups.findFirst({
      where: and(
        eq(sharedGroups.id, sharedGroupId),
        eq(sharedGroups.userId, userId),
      ),
    });
  },

  findByIdWithCards(sharedGroupId: string) {
    return db.query.sharedGroups.findFirst({
      where: eq(sharedGroups.id, sharedGroupId),
      with: { sharedCards: true },
    });
  },

  findGroupBySectionAndTitle(sectionId: string, title: string) {
    return db.query.groups.findFirst({
      where: and(eq(groups.sectionId, sectionId), eq(groups.title, title)),
    });
  },

  async createGroup(data: NewGroup) {
    const [row] = await db.insert(groups).values(data).returning();
    return row;
  },

  async createCard(data: {
    word: string;
    translateWord: string;
    groupId: string;
  }) {
    const [row] = await db.insert(cards).values(data).returning();
    return row;
  },

  async deleteSharedGroup(sharedGroupId: string) {
    const [row] = await db
      .delete(sharedGroups)
      .where(eq(sharedGroups.id, sharedGroupId))
      .returning();
    return row;
  },
};

export { SharedGroupRepository };
