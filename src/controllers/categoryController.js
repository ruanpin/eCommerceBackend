const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取商品种类列表失败' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: '商品种类名称是必填项' });
        }
        const isCategoryNameExist = await Category.getByName(name);
        if (isCategoryNameExist) {
            return res.status(400).json({ error: '此商品種類已存在' });
        }

        const categoryId = await Category.create(name);
        res.status(201).json({ 
            message: '商品种类创建成功',
            id: categoryId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建商品种类失败' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, id } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: '商品种类名称是必填项' });
        }

        const success = await Category.update(id, name);
        
        if (success) {
            res.json({ message: '商品种类更新成功' });
        } else {
            res.status(404).json({ error: '商品种类不存在' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '更新商品种类失败' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.query;
        const success = await Category.delete(id);
        
        if (success) {
            res.json({ message: '商品种类删除成功' });
        } else {
            res.status(404).json({ error: '商品种类不存在' });
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: '无法删除该商品种类，因为还有商品属于此类别' 
            });
        }
        res.status(500).json({ error: '删除商品种类失败' });
    }
}; 