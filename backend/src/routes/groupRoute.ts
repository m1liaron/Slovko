import {
  getAllGroups,
  addGroup,
  removeGroup,
  getGroup,
  updateGroup,
  moveGroupToAnotherSection,
} from "../controllers/groupController.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Group } from "../models/Group.js";
import { Section } from "../models/Section.js";
import {
  getAllGroupsSchema,
  getGroupSchema,
  removeGroupSchema,
  updateGroupSchema,
} from "../schemas/group.schema.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, patch, delete: remove, put } = authRouter();

get(
  "/:sectionId",
  verifyOwnership("section", {
    Model: Section,
    param: "sectionId",
  }),
  validate(getAllGroupsSchema),
  asyncHandler(getAllGroups),
);
post("/", asyncHandler(addGroup));

remove(
  "/:id/:sectionId",
  verifyOwnership("group", {
    Model: Group,
  }),
  validate(removeGroupSchema),
  asyncHandler(removeGroup),
);

get(
  "/:id/:sectionId",
  verifyOwnership("group", {
    Model: Group,
  }),
  validate(getGroupSchema),
  asyncHandler(getGroup),
);
patch(
  "/:id",
  verifyOwnership("group", {
    Model: Group,
  }),
  validate(updateGroupSchema),
  asyncHandler(updateGroup),
);
put(
  "/:id",
  verifyOwnership("group", {
    Model: Group,
  }),
  validate(updateGroupSchema),
  asyncHandler(moveGroupToAnotherSection),
);

export { router as groupRoute };
