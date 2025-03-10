const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // 构建筛选条件
        const filters = {};
        if (req.query.category_id) filters.category_id = req.query.category_id;
        if (req.query.gender) filters.gender = req.query.gender;
        if (req.query.is_new) filters.is_new = req.query.is_new === 'true';

        const products = await Product.getAll(page, limit, filters);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取商品列表失败' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({ error: '商品不存在' });
        }
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取商品详情失败' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category_id,
            gender,
            image_url,
            is_new
        } = req.body;

        // 验证必填字段
        if (!name || !price) {
            return res.status(400).json({ error: '商品名称和价格是必填项' });
        }

        // 验证价格和库存
        if (price < 0) {
            return res.status(400).json({ error: '价格不能为负数' });
        }
        if (stock < 0) {
            return res.status(400).json({ error: '库存不能为负数' });
        }

        const productData = {
            name,
            description,
            price,
            stock: stock || 0,
            category_id,
            gender,
            image_url,
            is_new: is_new || false
        };

        const productId = await Product.create(productData);
        res.status(201).json({ 
            message: '商品创建成功',
            id: productId 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: '指定的商品种类不存在' });
        }
        res.status(500).json({ error: '创建商品失败' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            stock,
            category_id,
            gender,
            image_url,
            is_new
        } = req.body;

        // 验证价格和库存
        if (price !== undefined && price < 0) {
            return res.status(400).json({ error: '价格不能为负数' });
        }
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ error: '库存不能为负数' });
        }

        const productData = {
            name,
            description,
            price,
            stock,
            category_id,
            gender,
            image_url,
            is_new
        };

        const success = await Product.update(id, productData);
        
        if (success) {
            res.json({ message: '商品更新成功' });
        } else {
            res.status(404).json({ error: '商品不存在' });
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: '指定的商品种类不存在' });
        }
        res.status(500).json({ error: '更新商品失败' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Product.delete(id);
        
        if (success) {
            res.json({ message: '商品删除成功' });
        } else {
            res.status(404).json({ error: '商品不存在' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '删除商品失败' });
    }
}; 