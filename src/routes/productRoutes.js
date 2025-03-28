const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/search', productController.searchProducts);

// 查詢單個產品
router.get('/:id', productController.getProductById);

// 查詢所有產品，並包含分頁
router.get('/', verifyToken, verifyAdmin, productController.getProducts);

// 新增產品
router.post('/', verifyToken, verifyAdmin, productController.createProduct);
// 更新產品
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);
// 刪除產品
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);

module.exports = router; 