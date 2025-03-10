const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// 訪客
router.get('/active', bannerController.getActiveBanners);

// admin權限
router.get('/', verifyToken, verifyAdmin, bannerController.getAllBanners);
router.post('/', verifyToken, verifyAdmin, bannerController.createBanner);
router.put('/:id', verifyToken, verifyAdmin, bannerController.updateBanner);
router.delete('/:id', verifyToken, verifyAdmin, bannerController.deleteBanner);

module.exports = router;