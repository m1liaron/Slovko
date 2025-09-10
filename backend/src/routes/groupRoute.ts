import { authRouter } from "./authRoute.js";
const { router, get, post, patch, delete: remove } = authRouter();
import {
  getAllGroups,
  addGroup,
  removeGroup,
  getGroup,
  updateGroup,
} from "../controllers/groupController.js";

get("/:sectionId", getAllGroups);
post("/", addGroup);

remove("/:id", removeGroup);
get("/:id", getGroup);
patch("/:id", updateGroup);

export { router as groupRoute };
