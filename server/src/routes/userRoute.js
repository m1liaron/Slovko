const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authenticationMiddleware');

router.route('/register').post(register)
router.route('/login').post(login)
router.get('/', authMiddleware, getUser);

module.exports = router;