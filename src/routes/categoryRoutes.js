const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// 公开路由
router.get('/', categoryController.getAllCategories);

// 需要管理员权限的路由
router.post('/', verifyToken, verifyAdmin, categoryController.createCategory);
router.put('/', verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete('/', verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;