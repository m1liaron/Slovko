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
} = require("../controllers/cardsController");

router.route("/repeated").post(getCardsFromIds);
router
	.route("/")
	.get(getRepeatedCards)
	.post(addCard)
router.route("/learn").put(updateCardsAfterReview);
router.route("/:groupId?").get(getAllCards);
router.route("/:groupId/:status").get(getAllStatusCards);
router.route("/:id").delete(removeCard).patch(updateCard);

module.exports = router;
