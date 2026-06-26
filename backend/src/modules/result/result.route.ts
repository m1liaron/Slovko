import { authRouter } from "@/libs/modules/route/auth.route.js";

const { router, get, post } = authRouter();
import {
    saveResults,
    getResults,
    getResultDetails,
    getResultsStatistics,
} from "./result.controller.js";
import { getResultsDetailsSchema, getResultsSchema, getResultsStatisticsSchema, saveResultsSchema } from "./result.schema.js";
import { validate, asyncHandler } from "@/middlewares/index.js";

get("/", validate(getResultsSchema), asyncHandler(getResults))
post("/", validate(saveResultsSchema), asyncHandler(saveResults))
get("/statistics", validate(getResultsStatisticsSchema), asyncHandler(getResultsStatistics))
get("/:resultId", validate(getResultsDetailsSchema), asyncHandler(getResultDetails))

export { router as resultRoute }