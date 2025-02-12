const express = require("express");
const router = express.Router();
const {
	createSharedGroup,
	getAllSharedGroup,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} = require("../controllers/sharedGroupController");

router.route("/").get(getAllSharedGroup).post(createSharedGroup);
router
	.route("/:sharedGroupId")
	.get(getSharedGroup)
	.post(copySharedGroup)
	.delete(removeSharedGroup);

module.exports = router;
