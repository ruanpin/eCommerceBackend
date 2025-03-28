const Category = require('../models/categoryModel');

class CategoryService {
    static async getAllCategories() {
        try {
            return await Category.getAll();
        } catch (error) {
            throw new Error('search failed.');
        }
    }

    static async createCategory(name) {
        if (!name) {
            throw new Error('The "name" field is required');
        }

        const isCategoryNameExist = await Category.getByName(name);
        if (isCategoryNameExist) {
            throw new Error('The category field already exist.');
        }

        return await Category.create(name);
    }

    static async updateCategory(id, name) {
        if (!name) {
            throw new Error('The "name" field is required');
        }

        const success = await Category.update(id, name);
        if (!success) {
            throw new Error('The category is not exist.');
        }
    }

    static async deleteCategory(id) {
        const success = await Category.delete(id);
        if (!success) {
            throw new Error('The category is not exist.');
        }
    }
}

module.exports = CategoryService;
