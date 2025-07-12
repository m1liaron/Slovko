import express from "express";
const router = express.Router();
import {
	createSharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} from "../controllers/sharedGroupController";

router.route("/").get(getAllSharedGroups).post(createSharedGroup);
router
	.route("/:sharedGroupId")
	.get(getSharedGroup)
	.post(copySharedGroup)
	.delete(removeSharedGroup);

export { router as sharedGroupRoute };
