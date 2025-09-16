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

remove("/:id", removeGroup);
get("/:id", getGroup);
patch("/:id", updateGroup);
put("/:id", moveGroupToAnotherSection);

export { router as groupRoute };
