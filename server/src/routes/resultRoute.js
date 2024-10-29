const express = require('express');
const router = express.Router();
const { saveResults  } = require('../controllers/resultsController');

router.route('/').post(saveResults)

module.exports = router;
