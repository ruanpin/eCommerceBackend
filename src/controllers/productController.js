const ProductService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const filters = {};
        if (req.query.category_id) filters.category_id = req.query.category_id;
        if (req.query.gender) filters.gender = req.query.gender;
        if (req.query.is_new) filters.is_new = req.query.is_new === 'true';

        const products = await ProductService.getAllProducts(page, limit, filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: '獲取商品列表失敗' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: '商品不存在' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: '獲取商品詳情失敗' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productId = await ProductService.createProduct(req.body);
        res.status(201).json({ message: '商品創建成功', id: productId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await ProductService.updateProduct(id, req.body);

        if (success) {
            res.json({ message: '商品更新成功' });
        } else {
            res.status(404).json({ error: '商品不存在' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await ProductService.deleteProduct(id);

        if (success) {
            res.json({ message: '商品刪除成功' });
        } else {
            res.status(404).json({ error: '商品不存在' });
        }
    } catch (error) {
        res.status(500).json({ error: '刪除商品失敗' });
    }
};
