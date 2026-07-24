import { eq } from "drizzle-orm";
import { sections } from "@/modules/section/schema";
import { groups } from "@/modules/group/schema";
import { cards } from "@/modules/card/schema";
import { sharedGroups } from "@/modules/sharedGroup/schema";
import { sharedCards } from "@/modules/sharedGroup/libs/shared-card/schema";

import type { OwnershipPolicies } from "../types/types.js";
import { db } from "@/db/drizzle";

const ownershipPolicies = {
  user: {
    ownerField: "id",
    isSelf: true,
  },
  section: {
    ownerField: "userId",
    findResource: (id: string) => db.query.sections.findFirst({ where: eq(sections.id, id) })
  },
  group: {
    findResource: (id: string) =>
      db.query.groups.findFirst({
        where: eq(groups.id, id),
        with: { section: true },
      }),
    ownerPath: "section.userId",
  },
  card: {
    ownerPath: "group.section.userId",
    findResource: (id: string) =>
      db.query.cards.findFirst({
        where: eq(cards.id, id),
        with: { group: { with: { section: true } } },
      }),
  },
  sharedGroup: {
    ownerField: "userId",
    findResource: (id: string) =>
      db.query.sharedGroups.findFirst({ where: eq(sharedGroups.id, id) }),
  },
  sharedCard: {
    ownerPath: "sharedGroup.userId",
    findResource: (id: string) =>
      db.query.sharedCards.findFirst({
        where: eq(sharedCards.id, id),
        with: { sharedGroup: true },
      }),
  },
} satisfies OwnershipPolicies;

export { ownershipPolicies };
