import {
    addSection,
    getAllSections,
    removeSection,
    updateSection,
} from "./section.controller";
import { asyncHandler, validate, verifyOwnership } from "@/middlewares";
import { updateSectionSchema, removeSectionSchema } from "./section.schema.js";
import { authRouter } from "@/libs/modules/route/auth.route.js";

const { router, get, post, patch, delete: remove } = authRouter();

get("/", asyncHandler(getAllSections));
post("/", asyncHandler(addSection));
patch(
    "/:id",
    verifyOwnership("section"),
    validate(updateSectionSchema),
    asyncHandler(updateSection),
);

remove(
    "/:id",
    verifyOwnership("section"),
    validate(removeSectionSchema),
    asyncHandler(removeSection),
);

export { router as sectionRoute };
