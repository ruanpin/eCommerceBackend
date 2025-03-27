const CategoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = await CategoryService.createCategory(name);
        res.status(201).json({ 
            message: '商品种类创建成功',
            id: categoryId 
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, id } = req.body;
        await CategoryService.updateCategory(id, name);
        res.json({ message: '商品种类更新成功' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.query;
        await CategoryService.deleteCategory(id);
        res.json({ message: '商品种类删除成功' });
    } catch (error) {
        console.error(error);
        if (error.message === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: '无法删除该商品种类，因为还有商品属于此类别' 
            });
        }
        res.status(400).json({ error: error.message });
    }
};