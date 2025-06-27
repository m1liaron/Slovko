const express = require("express");
const router = express.Router();
const {
	getAllCards,
	addCard,
	removeCard,
	updateCard,
	updateCardsAfterReview,
	getAllStatusCards,
	getRepeatedCards,
	getCardsFromIds,
	addManyCards,
} = require("../controllers/cardsController");

router.route("/repeated").post(getCardsFromIds);
router
	.route("/")
	.get(getRepeatedCards)
	.post(addCard)
router.route("/many").post(addManyCards)
router.route("/learn").put(updateCardsAfterReview);
router.route("/:groupId?").get(getAllCards);
router.route("/:groupId/:status").get(getAllStatusCards);
router.route("/:id").delete(removeCard).patch(updateCard);

module.exports = router;
