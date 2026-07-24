import { eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle.js";
import { cards } from "@/modules/card/schema";
import { type Group, type NewGroup } from "@/modules/group/schema";

import { groups } from "./group.model.js";

const GroupRepository = {
  async deleteBySectionId(sectionId: string) {
    return db.delete(groups).where(eq(groups.sectionId, sectionId)).returning();
  },
  async findAllBySection(sectionId: string) {
    return db
      .select({
        id: groups.id,
        title: groups.title,
        sectionId: groups.sectionId,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        toLearnCount: sql<number>`count(*) filter (where ${cards.status} = 'To Learn')::int`,
        repeatedCount: sql<number>`count(*) filter (where ${cards.status} = 'Repeated')::int`,
        knowCount: sql<number>`count(*) filter (where ${cards.status} = 'Know')::int`,
        learnedCount: sql<number>`count(*) filter (where ${cards.status} = 'Learned')::int`,
      })
      .from(groups)
      .leftJoin(cards, eq(cards.groupId, groups.id))
      .where(eq(groups.sectionId, sectionId))
      .groupBy(groups.id);
  },

  async findOneWithCounts(groupId: string) {
    const [group] = await db
      .select({
        id: groups.id,
        title: groups.title,
        sectionId: groups.sectionId,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        learnToCardsAmount: sql<number>`count(*) filter (where ${cards.status} = 'To Learn')::int`,
        learnedCardsAmount: sql<number>`count(*) filter (where ${cards.status} = 'Learned')::int`,
        knowCardsAmount: sql<number>`count(*) filter (where ${cards.status} = 'Know')::int`,
      })
      .from(groups)
      .leftJoin(cards, eq(cards.groupId, groups.id))
      .where(eq(groups.id, groupId))
      .groupBy(groups.id);

    return group;
  },

  async findByTitleAndSection(title: string, sectionId: string) {
    return db.query.groups.findFirst({
      where: (g, { and, eq }) =>
        and(eq(g.title, title), eq(g.sectionId, sectionId)),
    });
  },

  async findById(id: string): Promise<Group | undefined> {
    return db.query.groups.findFirst({ where: eq(groups.id, id) });
  },

  async create(data: NewGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(data).returning();
    return group;
  },

  async updateById(
    id: string,
    data: Partial<NewGroup>,
  ): Promise<Group | undefined> {
    const [group] = await db
      .update(groups)
      .set(data)
      .where(sql`${groups.id} = ${id}`)
      .returning();
    return group;
  },

  async updateSectionId(
    id: string,
    sectionId: string,
  ): Promise<Group | undefined> {
    const [group] = await db
      .update(groups)
      .set({ sectionId })
      .where(eq(groups.id, id))
      .returning();
    return group;
  },

  async deleteById(id: string): Promise<Group | undefined> {
    const [group] = await db
      .delete(groups)
      .where(eq(groups.id, id))
      .returning();
    return group;
  },
};

export { GroupRepository };
