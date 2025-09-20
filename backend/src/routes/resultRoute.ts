import { authRouter } from "./authRoute.js";
const { router, get, post } = authRouter();
import {
	saveResults,
	getResults,
	getResultDetails,
	getResultsStatistics,
} from "../controllers/resultsController.js";

get("/", getResults)
post("/", saveResults)
get("/statistics", getResultsStatistics)
get("/:resultId", getResultDetails)

export { router as resultRoute }