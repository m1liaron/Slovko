const express = require('express');
const router = express.Router();
const { saveResults, getResults  } = require('../controllers/resultsController');

router.route('/').get(getResults).post(saveResults)

module.exports = router;
