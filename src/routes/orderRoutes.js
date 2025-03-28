const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// 確保只有管理員可以訪問
router.get('/', verifyToken, verifyAdmin, orderController.getOrders);
router.get('/:orderId', verifyToken, verifyAdmin, orderController.getOrderById);
router.post('/', verifyToken, verifyAdmin, orderController.createOrder);
router.put('/:orderId', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.delete('/:orderId', verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
