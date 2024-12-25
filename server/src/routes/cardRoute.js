const express = require('express');
const router = express.Router();
const { getAllCards, addCard, removeCard, updateCard, updateCardsAfterReview, getAllStatusCards, getRepeatedCards, getCardsFromIds } = require('../controllers/cardsController');

router.route('/repeated').get(getCardsFromIds)
router.route('/').get(getRepeatedCards).post(addCard);
router.route('/:groupId').put(updateCardsAfterReview).get(getAllCards)
router.route('/:groupId/:status').get(getAllStatusCards);
router.route('/:id').delete(removeCard).patch(updateCard);

module.exports = router;
