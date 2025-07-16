import { authRouter } from "./authRouter.js";
const { router, get, post, patch, delete: remove } = authRouter();
import {
	getAllGroups,
	addGroup,
	removeGroup,
	getGroup,
	updateGroup,
} from "../controllers/groupController.js";

get("/", getAllGroups)
post("/", addGroup);

remove("/:id", removeGroup)
get("/:id", getGroup)
patch("/:id", updateGroup)

export { router as groupRoute };
