import { Group } from "../../../models/Group.js";
import { SharedGroup } from "../../../models/models.js";
import { Section } from "../../../models/Section.js";
import type { OwnershipPolicies } from "../../types/types.js";

const ownershipPolicies = {
  user: {
    ownerField: "userId",
  },
  section: {
    ownerField: "userId",
  },
  group: {
    include: [{ model: Section, as: "section" }],
    ownerPath: "section.userId",
  },
  card: {
    include: [
      {
        model: Group,
        as: "group",
        include: [{ model: Section, as: "section" }],
      },
    ],
    ownerPath: "group.section.userId",
  },
  sharedGroup: {
    ownerField: "userId",
  },
  sharedCard: {
    include: [{ model: SharedGroup, as: "sharedGroup" }],
    ownerPath: "sharedGroup.userId",
  },
} satisfies OwnershipPolicies;

export { ownershipPolicies };
