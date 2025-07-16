import { authRouter } from "./authRouter";
const { router, get, post } = authRouter();
import {
	saveResults,
	getResults,
	getResultDetails,
	getResultsStatistics,
} from "../controllers/resultsController";

get("/", getResults)
post("/", saveResults)
get("/statistics", getResultsStatistics)
get("/:resultId", getResultDetails)

export { router as resultRoute }