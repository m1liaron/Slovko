const express = require('express');
const router = express.Router();
const { register, login, getUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authenticationMiddleware');

router.route('/register').post(register)
router.route('/login').post(login)
router.get('/', authMiddleware, getUser);
router.put('/:userId', authMiddleware, updateUser);

module.exports = router;