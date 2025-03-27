const Category = require('../models/categoryModel');

class CategoryService {
    // 獲取所有商品類別
    static async getAllCategories() {
        try {
            return await Category.getAll();
        } catch (error) {
            throw new Error('獲取商品種類失敗');
        }
    }

    // 創建商品類別
    static async createCategory(name) {
        if (!name) {
            throw new Error('商品種類名稱是必填項');
        }

        const isCategoryNameExist = await Category.getByName(name);
        if (isCategoryNameExist) {
            throw new Error('此商品種類已存在');
        }

        return await Category.create(name);
    }

    // 更新商品類別
    static async updateCategory(id, name) {
        if (!name) {
            throw new Error('商品種類名稱是必填項');
        }

        const success = await Category.update(id, name);
        if (!success) {
            throw new Error('商品種類不存在');
        }
    }

    // 刪除商品類別
    static async deleteCategory(id) {
        const success = await Category.delete(id);
        if (!success) {
            throw new Error('商品種類不存在');
        }
    }
}

module.exports = CategoryService;
