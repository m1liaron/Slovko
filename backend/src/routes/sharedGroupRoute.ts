import { authRouter } from "./authRoute.js";
const { router, get, post, delete: remove } = authRouter();
import {
	createSharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} from "../controllers/sharedGroupController.js";

get("/", getAllSharedGroups);
post("/", createSharedGroup);

get("/:sharedGroupId", getSharedGroup);
post("/:sharedGroupId", copySharedGroup);
remove("/:sharedGroupId", removeSharedGroup);

export { router as sharedGroupRoute };
