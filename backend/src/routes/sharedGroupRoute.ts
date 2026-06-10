import {
  createSharedGroup,
  getAllSharedGroups,
  getSharedGroup,
  copySharedGroup,
  removeSharedGroup,
} from "../controllers/sharedGroupController.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { SharedGroup } from "../models/models.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, delete: remove } = authRouter();

get("/", getAllSharedGroups);
post("/", createSharedGroup);

get("/:sharedGroupId", getSharedGroup);
post("/:sharedGroupId", copySharedGroup);
remove(
  "/:sharedGroupId",
  verifyOwnership("sharedGroup", {
    Model: SharedGroup,
  }),
  removeSharedGroup,
);

export { router as sharedGroupRoute };
