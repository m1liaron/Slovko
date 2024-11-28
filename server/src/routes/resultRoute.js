const express = require('express');
const router = express.Router();
const { saveResults, getResults, getResultDetails, getResultsDetails } = require('../controllers/resultsController');

router.route('/details').get(getResultsDetails)
router.route('/').get(getResults).post(saveResults);
router.route('/:resultId').get(getResultDetails);

module.exports = router;
