const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authenticationMiddleware');

router.route('/register').post(register)
router.route('/login').post(login)
router.post('/', authMiddleware).get(getUser);

module.exports = router;