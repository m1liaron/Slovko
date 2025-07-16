import { authRouter } from "./authRouter.js";
const { router, get, post } = authRouter();
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

router.route("/repeated").post(getCardsFromIds);
get("/", getRepeatedCards)
post("/", addCard)
router.route("/many").post(addManyCards)
router.route("/learn").put(updateCardsAfterReview);
router.route("/:groupId?").get(getAllCards);
router.route("/:groupId/:status").get(getAllStatusCards);
router.route("/:id").delete(removeCard).patch(updateCard);

export { router as cardRoute }
