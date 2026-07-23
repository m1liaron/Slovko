import { eq, and } from "drizzle-orm";

import { db } from "@/db/drizzle.js";

import { sections, type Section, type NewSection } from "./section.model.js";

const SectionRepository = {
  async findAllByUser(userId: string) {
    return db.query.sections.findMany({
      where: eq(sections.userId, userId),
      with: {
        language: {
          columns: { id: true, title: true, symbol: true },
        },
      },
    });
  },

  async findOne(where: {
    title?: string;
    languageId?: string;
    userId?: string;
  }) {
    const conditions = [];
    if (where.title !== undefined)
      conditions.push(eq(sections.title, where.title));
    if (where.languageId !== undefined)
      conditions.push(eq(sections.languageId, where.languageId));
    if (where.userId !== undefined)
      conditions.push(eq(sections.userId, where.userId));
    return db.query.sections.findFirst({ where: and(...conditions) });
  },

  async findByLanguageAndUser(languageId: string, userId: string) {
    return db.query.sections.findFirst({
      where: and(
        eq(sections.languageId, languageId),
        eq(sections.userId, userId),
      ),
      with: {
        language: { columns: { id: true, title: true, symbol: true } },
      },
    });
  },

  async findByIdAndUser(id: string, userId: string) {
    return db.query.sections.findFirst({
      where: and(eq(sections.id, id), eq(sections.userId, userId)),
    });
  },

  async create(data: NewSection): Promise<Section> {
    const [section] = await db.insert(sections).values(data).returning();
    return section;
  },

  async updateByIdAndUser(
    id: string,
    userId: string,
    data: Partial<NewSection>,
  ): Promise<Section | undefined> {
    const [section] = await db
      .update(sections)
      .set(data)
      .where(and(eq(sections.id, id), eq(sections.userId, userId)))
      .returning();
    return section;
  },

  async deleteById(id: string): Promise<Section | undefined> {
    const [section] = await db
      .delete(sections)
      .where(eq(sections.id, id))
      .returning();
    return section;
  },
};

export { SectionRepository };
