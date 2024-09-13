const express = require('express');
const router = express.Router();
const { getAllCards, addCard, removeCard, updateCardsAfterReview, getAllStatusCards } = require('../controllers/cardsController');

router.route('/').post(addCard).get(getAllStatusCards);
router.route('/:groupId').put(updateCardsAfterReview).get(getAllCards)
router.route('/:id').delete(removeCard);

module.exports = router;
