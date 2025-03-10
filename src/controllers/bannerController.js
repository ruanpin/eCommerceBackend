const Banner = require('../models/bannerModel');

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.getAll();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: '获取横幅列表失败' });
    }
};

exports.getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.getActive();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: '获取活动横幅失败' });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const { image_url, link, is_active } = req.body;
        
        // 验证必填字段
        if (!image_url) {
            return res.status(400).json({ error: '图片URL是必填项' });
        }

        const bannerData = {
            image_url,
            link,
            is_active: is_active !== undefined ? is_active : true
        };

        const bannerId = await Banner.create(bannerData);
        res.status(201).json({ message: '横幅创建成功', id: bannerId });
    } catch (error) {
        res.status(500).json({ error: '创建横幅失败' });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_url, link, is_active } = req.body;
        
        // 获取当前横幅信息
        const currentBanner = await Banner.getById(id);
        if (!currentBanner) {
            return res.status(404).json({ error: '横幅不存在' });
        }

        const bannerData = {};
        
        if (image_url !== undefined) bannerData.image_url = image_url;
        if (link !== undefined) bannerData.link = link;
        if (is_active !== undefined) bannerData.is_active = is_active;

        const success = await Banner.update(id, bannerData);
        
        if (success) {
            res.json({ message: '横幅更新成功' });
        } else {
            res.status(404).json({ error: '横幅不存在' });
        }
    } catch (error) {
        res.status(500).json({ error: '更新横幅失败' });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 获取横幅信息
        const banner = await Banner.getById(id);
        if (!banner) {
            return res.status(404).json({ error: '横幅不存在' });
        }

        // 删除数据库记录
        const success = await Banner.delete(id);
        
        if (success) {
            res.json({ message: '横幅删除成功' });
        } else {
            res.status(404).json({ error: '横幅不存在' });
        }
    } catch (error) {
        res.status(500).json({ error: '删除横幅失败' });
    }
}; 