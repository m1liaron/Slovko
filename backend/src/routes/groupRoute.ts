import { authRouter } from "./authRoute.js";

const { router, get, post, patch, delete: remove, put } = authRouter();
import {
  getAllGroups,
  addGroup,
  removeGroup,
  getGroup,
  updateGroup,
  moveGroupToAnotherSection,
} from "../controllers/groupController.js";

get("/:sectionId", getAllGroups);
post("/", addGroup);

remove("/:groupId/:sectionId", removeGroup);
get("/:groupId/:sectionId", getGroup);
patch("/:groupId", updateGroup);
put("/:id", moveGroupToAnotherSection);

export { router as groupRoute };
