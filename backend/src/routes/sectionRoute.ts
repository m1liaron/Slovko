import {
  addSection,
  getAllSections,
  removeSection,
  updateSection,
} from "../controllers/sectionController.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { validate } from "../middlewares/index.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Section } from "../models/Section.js";
import { updateSectionSchema, removeSectionSchema } from "../schemas/index.js";

import { authRouter } from "./authRoute.js";
const { router, get, post, patch, delete: remove } = authRouter();

get("/", asyncHandler(getAllSections));
post("/", asyncHandler(addSection));
patch(
  "/:id",
  verifyOwnership("section", {
    Model: Section,
  }),
  validate(updateSectionSchema),
  asyncHandler(updateSection),
);

remove(
  "/:id",
  verifyOwnership("section", {
    Model: Section,
  }),
  validate(removeSectionSchema),
  asyncHandler(removeSection),
);

export { router as sectionRoute };
