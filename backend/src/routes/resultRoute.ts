import { authRouter } from "./authRoute.js";

const { router, get, post } = authRouter();
import {
	saveResults,
	getResults,
	getResultDetails,
	getResultsStatistics,
	getResultsDetails,
} from "../controllers/resultsController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { getResultsDetailsSchema, getResultsSchema, getResultsStatisticsSchema, saveResultsSchema } from "../schemas/result.schema.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

get("/", validate(getResultsSchema), asyncHandler(getResults))
post("/", validate(saveResultsSchema), asyncHandler(saveResults))
get("/statistics", validate(getResultsStatisticsSchema), asyncHandler(getResultsStatistics))
get("/:resultId", validate(getResultsDetailsSchema), asyncHandler(getResultDetails))

export { router as resultRoute }