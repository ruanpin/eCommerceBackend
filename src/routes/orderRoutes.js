const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin, verifyMember } = require('../middlewares/authMiddleware');

// 確保只有管理員可以訪問
router.get('/admin/', verifyToken, verifyAdmin, orderController.getOrders);
router.get('/admin/:orderId', verifyToken, verifyAdmin, orderController.getOrderById);
router.post('/admin/', verifyToken, verifyAdmin, orderController.createOrder);
router.put('/admin/:orderId', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.delete('/admin/:orderId', verifyToken, verifyAdmin, orderController.deleteOrder);

// 會員
router.post('/member', verifyToken, verifyMember, orderController.createOrder_member); // 創建訂單
router.get('/member', verifyToken, verifyMember, orderController.getOrders_member); // 查詢訂單 (加上分頁器)
router.put('/member/:orderId', verifyToken, verifyMember, orderController.updateOrderStatus_member); // 更新訂單狀態

module.exports = router;
