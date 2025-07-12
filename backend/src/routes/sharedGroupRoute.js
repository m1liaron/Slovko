const express = require("express");
const router = express.Router();
const {
	createSharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} = require("../controllers/sharedGroupController");

router.route("/").get(getAllSharedGroups).post(createSharedGroup);
router
	.route("/:sharedGroupId")
	.get(getSharedGroup)
	.post(copySharedGroup)
	.delete(removeSharedGroup);

module.exports = router;
