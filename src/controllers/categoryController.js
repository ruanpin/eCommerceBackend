const CategoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.json({
            data: categories,
            message: "success",
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, status: 400 });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = await CategoryService.createCategory(name);
        res.status(200).json({ 
            message: 'created successfully.',
            id: categoryId,
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message, status: 400 });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, id } = req.body;
        await CategoryService.updateCategory(id, name);
        res.json({ message: 'updated successfully.', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message, status: 400 });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.query;
        await CategoryService.deleteCategory(id);
        res.json({ message: 'deleted successfully.' });
    } catch (error) {
        console.error(error);
        if (error.message === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: 'Cannot delete this product category because there are still products belonging to it.',
                status: 400 
            });
        }
        res.status(400).json({ message: error.message, status: 400 });
    }
};