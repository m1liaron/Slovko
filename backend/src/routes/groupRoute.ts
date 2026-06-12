import {
  getAllGroups,
  addGroup,
  removeGroup,
  getGroup,
  updateGroup,
  moveGroupToAnotherSection,
} from "../controllers/groupController.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Group } from "../models/Group.js";
import { Section } from "../models/Section.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, patch, delete: remove, put } = authRouter();

get(
  "/:sectionId",
  verifyOwnership("section", {
    Model: Section,
    param: "sectionId",
  }),
  getAllGroups,
);
post("/", addGroup);

remove(
  "/:id/:sectionId",
  verifyOwnership("group", {
    Model: Group,
  }),
  removeGroup,
);

get(
  "/:id/:sectionId",
  verifyOwnership("group", {
    Model: Group,
  }),
  getGroup,
);
patch(
  "/:id",
  verifyOwnership("group", {
    Model: Group,
  }),
  updateGroup,
);
put(
  "/:id",
  verifyOwnership("group", {
    Model: Group,
  }),
  moveGroupToAnotherSection,
);

export { router as groupRoute };
