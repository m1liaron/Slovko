const express = require('express');
const router = express.Router();

const { getAllCards, addCard, removeCard } = require('../controllers/cardsController');
const {add} = require("react-native-track-player/src/trackPlayer");

router.route('/').get(getAllCards).post(addCard);
router.route('/:id').delete(removeCard)