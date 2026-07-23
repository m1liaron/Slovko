import { and, eq, ilike, inArray, lte, or } from "drizzle-orm";

import { db, Transaction } from "@/db/drizzle.js";
import { type Card, cards, NewCard } from "./card.model.js";
import { groups } from "../group/group.model.js";

const CardRepository = {
  async deleteByGroupId(groupId: string) {
    return db.delete(cards).where(eq(cards.groupId, groupId)).returning();
  },

  async findRepeatedCardsBySection(sectionId: string) {
    return db
      .select({
          groupId: groups.id,
          groupTitle: groups.title,
          cardId: cards.id
      })
      .from(groups)
      .innerJoin(
        cards,
        and(eq(cards.groupId, groups.id), lte(cards.nextReviewAt, new Date()))
      )
      .where(eq(groups.sectionId, sectionId))
  },

  async findByStatusAndGroup(status: Card["status"], groupId: string): Promise<Card[]> {
    return db.query.cards.findMany({
      where: and(eq(cards.status, status), eq(cards.groupId, groupId)),
    });
  },

  async findByGroupIdWithImage(groupId: string) {
    return db.query.cards.findMany({
      where: eq(cards.groupId, groupId),
      with: { image: true }
    })
  },

  async findByIdsWithImage(ids: string[]) {
    return db.query.cards.findMany({
      where: inArray(cards.id, ids),
      with: { image: true }
    })
  },

  async findByIds(ids: string[]): Promise<Card[]> {
    return db.query.cards.findMany({ where: inArray(cards.id, ids) });
  }, 

  async updateById(id: string, data: Partial<NewCard>): Promise<Card | undefined> {
    const [card] = await db.update(cards).set(data).where(eq(cards.id, id)).returning();
    return card;
  },

  async findByGroupAndWordCI(groupId: string, word: string): Promise<Card | undefined> {
    return db.query.cards.findFirst({
      where: and(eq(cards.groupId, groupId), ilike(cards.word, word))
    });
  },

  async create(data: NewCard): Promise<Card> {
    const [card] = await db.insert(cards).values(data).returning();
    return card;
  },

  async findByIdAndGroupWithImage(id: string, groupId: string) {
    return db.query.cards.findFirst({
      where: and(eq(cards.id, id), eq(cards.groupId, groupId)),
      with: { image: true },
    });
  },

  async findExistingWordsInGroup(
    groupId: string,
    words: string[],
    tx: Transaction,
  ): Promise<Card[]> {
    return tx.query.cards.findMany({
      where: and(
        eq(cards.groupId, groupId),
        or(...words.map((word) => ilike(cards.word, word))),
      ),
    });
  },

  async bulkCreate(data: NewCard[], tx: Transaction = db): Promise<Card[]> {
    if (data.length === 0) return [];
    return tx.insert(cards).values(data).returning();
  },

  async updateByIdAndGroup(
    id: string,
    groupId: string,
    data: Partial<NewCard>,
  ): Promise<Card | undefined> {
    const [card] = await db
      .update(cards)
      .set(data)
      .where(and(eq(cards.id, id), eq(cards.groupId, groupId)))
      .returning();
    return card;
  },

  async deleteById(id: string): Promise<Card | undefined> {
    const [card] = await db.delete(cards).where(eq(cards.id, id)).returning();
    return card;
  },
};

export { CardRepository };
