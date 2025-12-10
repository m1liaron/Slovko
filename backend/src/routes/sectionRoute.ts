import { addSection, getAllSections, removeSection, updateSection } from "../controllers/sectionController.js";

import { authRouter } from "./authRoute.js";
const { router, get, post, patch, delete: remove } = authRouter();

get("/", getAllSections);
post("/", addSection);
patch("/:id", updateSection);
remove("/:id", removeSection);

export { router as sectionRoute }
