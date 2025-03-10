const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/userInfo', verifyToken, authController.userInfo);

module.exports = router;
