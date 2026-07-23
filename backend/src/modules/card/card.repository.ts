import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle.js";

import { cards } from "./card.model.js";

const CardRepository = {
  async deleteByGroupId(groupId: string) {
    return db.delete(cards).where(eq(cards.groupId, groupId)).returning();
  },
};

export { CardRepository };
