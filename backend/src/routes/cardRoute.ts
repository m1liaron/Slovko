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
import { validate } from "../middlewares/validateMiddleware.js";
import { verifyOwnership } from "../middlewares/verifyOwnership.middleware.js";
import { Card } from "../models/Card.js";
import { Section } from "../models/Section.js";
import {
  addCardSchema,
  addManyCardsSchema,
  getAllCardsSchema,
  getAllStatusCardsSchema,
  getCardsFromIdsSchema,
  getRepeatedCardsSchema,
  removeCardSchema,
  updateCardsAfterReviewSchema,
  updateCardSchema,
} from "../schemas/card.schema.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, delete: remove, patch } = authRouter();

router
  .route("/repeated")
  .post(validate(getCardsFromIdsSchema), getCardsFromIds);
get(
  "/repeated/:sectionId",
  verifyOwnership("section", {
    Model: Section,
    param: "sectionId",
  }),
  validate(getRepeatedCardsSchema),
  getRepeatedCards,
);
post("/", validate(addCardSchema), addCard);
router.route("/many").post(validate(addManyCardsSchema), addManyCards);
router
  .route("/learn")
  .put(validate(updateCardsAfterReviewSchema), updateCardsAfterReview);
router.route("/:groupId").get(validate(getAllCardsSchema), getAllCards);
router
  .route("/:groupId/:status")
  .get(validate(getAllStatusCardsSchema), getAllStatusCards);
remove(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  validate(removeCardSchema),
  removeCard,
);
patch(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  validate(updateCardSchema),
  updateCard,
);

export { router as cardRoute };
