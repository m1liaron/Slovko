import {
  getAllCards,
  addCard,
  removeCard,
  updateCard,
  updateCardsAfterReview,
  getAllStatusCards,
  getRepeatedCards,
  getCardsFromIds,
  addManyCards,
} from "../controllers/cardsController.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Card } from "../models/Card.js";
import { Section } from "../models/Section.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, delete: remove, patch } = authRouter();

router.route("/repeated").post(getCardsFromIds);
get(
  "/repeated/:sectionId",
  verifyOwnership("section", {
    Model: Section,
    param: "sectionId",
  }),
  getRepeatedCards,
);
post("/", addCard);
router.route("/many").post(addManyCards);
router.route("/learn").put(updateCardsAfterReview);
router.route("/:groupId").get(getAllCards);
router.route("/:groupId/:status").get(getAllStatusCards);
remove(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  removeCard,
);
patch(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  updateCard,
);

export { router as cardRoute };
