const express = require('express');
const router = express.Router();
const { saveResults, getResults, getResultDetails} = require('../controllers/resultsController');

router.route('/').get(getResults).post(saveResults);
router.route('/:resultId').get(getResultDetails);

module.exports = router;
