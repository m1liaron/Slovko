const express = require('express');
const router = express.Router();
const { getAllCards, addCard, removeCard, updateCardAfterReview } = require('../controllers/cardsController');

router.route('/').post(addCard);
router.route('/:groupId').get(getAllCards)
router.route('/:id').put(updateCardAfterReview).delete(removeCard);

module.exports = router;
