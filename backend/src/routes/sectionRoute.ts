import {
  addSection,
  getAllSections,
  removeSection,
  updateSection,
} from "../controllers/sectionController.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Section } from "../models/Section.js";

import { authRouter } from "./authRoute.js";
const { router, get, post, patch, delete: remove } = authRouter();

get("/", getAllSections);
post("/", addSection);
patch(
  "/:id",
  verifyOwnership("section", {
    Model: Section,
  }),
  updateSection,
);
remove(
  "/:id",
  verifyOwnership("section", {
    Model: Section,
  }),
  removeSection,
);

export { router as sectionRoute };
