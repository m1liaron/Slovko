const express = require('express');
const router = express.Router();
const { getAllCards, addCard, removeCard } = require('../controllers/cardsController');

router.route('/').get(getAllCards).post(addCard);
router.route('/:id').delete(removeCard);

module.exports = router;
