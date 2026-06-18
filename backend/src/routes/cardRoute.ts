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
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
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
  .post(validate(getCardsFromIdsSchema), asyncHandler(getCardsFromIds));
get(
  "/repeated/:sectionId",
  verifyOwnership("section", {
    Model: Section,
    param: "sectionId",
  }),
  validate(getRepeatedCardsSchema),
  asyncHandler(getRepeatedCards),
);
post("/", validate(addCardSchema), addCard);
router.route("/many").post(validate(addManyCardsSchema), asyncHandler(addManyCards));
router
  .route("/learn")
  .put(validate(updateCardsAfterReviewSchema), asyncHandler(updateCardsAfterReview));
router.route("/:groupId").get(validate(getAllCardsSchema), asyncHandler(getAllCards));
router
  .route("/:groupId/:status")
  .get(validate(getAllStatusCardsSchema), asyncHandler(getAllStatusCards));
remove(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  validate(removeCardSchema),
  asyncHandler(removeCard),
);
patch(
  "/:id",
  verifyOwnership("card", {
    Model: Card,
  }),
  validate(updateCardSchema),
  asyncHandler(updateCard),
);

export { router as cardRoute };
