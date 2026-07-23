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
} from "./card.controller";
import { asyncHandler, validate, verifyOwnership } from "@/middlewares/index";
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
} from "./card.schema.js";
import { authRouter } from "@/libs/modules/route";

const { router, get, post, delete: remove, patch } = authRouter();

router
  .route("/repeated")
  .post(validate(getCardsFromIdsSchema), asyncHandler(getCardsFromIds));
get(
  "/repeated/:sectionId",
  verifyOwnership("section", {
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
  verifyOwnership("card"),
  validate(removeCardSchema),
  asyncHandler(removeCard),
);
patch(
  "/:id",
  verifyOwnership("card"),
  validate(updateCardSchema),
  asyncHandler(updateCard),
);

export { router as cardRoute };
