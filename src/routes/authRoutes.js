const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/userInfo', verifyToken, authController.getUserInfo);
router.put('/userInfo', verifyToken, authController.updateUserInfo);

module.exports = router;
