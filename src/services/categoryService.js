const Category = require('../models/categoryModel');

class CategoryService {
    static async getAllCategories() {
        try {
            return await Category.getAll();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
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
        if (!id) {
            throw new Error('The "id" field is required');
        }
        if (!name) {
            throw new Error('The "name" field is required');
        }

        const success = await Category.update(id, name);
        if (!success) {
            throw new Error('The category does not exist.');
        }
    }

    static async deleteCategory(id) {
        try {
            const success = await Category.delete(id);
            if (!success) {
                throw new Error('The category does not exist.');
            }
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('Cannot delete this category because there are still products associated with it.');
            }
            throw error;
        }
    }
}

module.exports = CategoryService;
