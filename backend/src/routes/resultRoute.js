const express = require("express");
const router = express.Router();
const {
	saveResults,
	getResults,
	getResultDetails,
	getResultsDetails,
	getResultsStatistics,
} = require("../controllers/resultsController");

router.route("/statistics").get(getResultsStatistics);
router.route("/").get(getResults).post(saveResults);
router.route("/:resultId").get(getResultDetails);

module.exports = router;
