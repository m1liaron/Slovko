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
import { verifyOwnershipMiddleware } from "../middlewares/verifyOwnership.middleware.js";
import { Card } from "../models/Card.js";
import { Group } from "../models/Group.js";
import { Section } from "../models/Section.js";

import { authRouter } from "./authRoute.js";

const { router, get, post, delete: remove, patch } = authRouter();

router.route("/repeated").post(getCardsFromIds);
get("/repeated/:sectionId", getRepeatedCards);
post("/", addCard);
router.route("/many").post(addManyCards);
router.route("/learn").put(updateCardsAfterReview);
router.route("/:groupId").get(getAllCards);
router.route("/:groupId/:status").get(getAllStatusCards);
remove(
  "/:id",
  verifyOwnershipMiddleware({
    Model: Card,
    include: [
      {
        model: Group,
        as: "group",
        include: [{ model: Section, as: "section" }],
      },
    ],
    ownerPath: "group.section.userId",
  }),
  removeCard,
);
patch(
  "/:id",
  verifyOwnershipMiddleware({
    Model: Card,
    include: [
      {
        model: Group,
        as: "group",
        include: [{ model: Section, as: "section" }],
      },
    ],
    ownerPath: "group.section.userId",
  }),
  updateCard,
);

export { router as cardRoute };
