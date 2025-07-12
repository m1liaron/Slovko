import express from "express";
const router = express.Router();
import {
	saveResults,
	getResults,
	getResultDetails,
	getResultsStatistics,
} from "../controllers/resultsController";

router.route("/statistics").get(getResultsStatistics);
router.route("/").get(getResults).post(saveResults);
router.route("/:resultId").get(getResultDetails);

export { router as resultRoute }