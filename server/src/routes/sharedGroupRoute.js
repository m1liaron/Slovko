const express = require('express');
const router = express.Router();
const {
    createSharedGroup,
    getAllSharedGroup,
    getSharedGroup,
    copySharedGroup,
} = require('../controllers/sharedGroupController');

router.route('/').get(getAllSharedGroup).post(createSharedGroup);
router.route('/:id').get(getSharedGroup).post(copySharedGroup)

module.exports = router;