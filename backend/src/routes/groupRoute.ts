const express = require("express");
const router = express.Router();
const {
	getAllGroups,
	addGroup,
	removeGroup,
	getGroup,
	updateGroup,
} = require("../controllers/groupController");

router.route("/").get(getAllGroups).post(addGroup);
router.route("/:id").delete(removeGroup).get(getGroup).patch(updateGroup);

module.exports = router;
