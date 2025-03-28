const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { verifyToken, verifyMember } = require('../middlewares/authMiddleware');

// 商品操作
router.post('/add', verifyToken, verifyMember, CartController.addItem);
router.put('/update', verifyToken, verifyMember, CartController.updateItem);
router.delete('/remove/:id', verifyToken, verifyMember, CartController.removeItem);
router.get('/cart', verifyToken, verifyMember, CartController.getCart);

module.exports = router;
