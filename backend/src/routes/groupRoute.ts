import express from "express";
const router = express.Router();
import {
	getAllGroups,
	addGroup,
	removeGroup,
	getGroup,
	updateGroup,
} from "../controllers/groupController";

router.route("/").get(getAllGroups).post(addGroup);
router.route("/:id").delete(removeGroup).get(getGroup).patch(updateGroup);

export { router as groupRoute };
