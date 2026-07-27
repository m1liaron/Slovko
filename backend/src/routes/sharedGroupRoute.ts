import {
  createSharedGroup,
  getAllSharedGroups,
  getSharedGroup,
  copySharedGroup,
  removeSharedGroup,
} from "../controllers/sharedGroupController.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { SharedGroup } from "../models/models.js";
import {
  copySharedGroupSchema,
  createSharedGroupSchema,
  getAllSharedGroupsSchema,
  getSharedGroupSchema,
  removeSharedGroupSchema,
} from "../schemas/sharedGroup.schema.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, delete: remove } = authRouter();

get("/", validate(getAllSharedGroupsSchema), asyncHandler(getAllSharedGroups));
post("/", validate(createSharedGroupSchema), asyncHandler(createSharedGroup));

get(
  "/:sharedGroupId",
  validate(getSharedGroupSchema),
  asyncHandler(getSharedGroup),
);
post(
  "/:sharedGroupId",
  validate(copySharedGroupSchema),
  asyncHandler(copySharedGroup),
);
remove(
  "/:sharedGroupId",
  verifyOwnership("sharedGroup", {
    Model: SharedGroup,
  }),
  validate(removeSharedGroupSchema),
  asyncHandler(removeSharedGroup),
);

export { router as sharedGroupRoute };
