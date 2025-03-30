const Product = require('../models/productModel');

class ProductService {
    static async searchProducts(page, pageSize, keyword, categoryId) {
        try {
            const { data, total } = await Product.searchProducts(page, pageSize, keyword, categoryId);
            return { data, total };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    // 查詢所有產品，並包含分頁器
    static async getAll(page = 1, pageSize = 10) {
        const products = await Product.getAll(page, pageSize);
        return products;
    }

    // 查詢單個產品
    static async getById(id) {
        const product = await Product.getById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    // 新增產品
    static async create(data) {
        const { name, description, category_id, is_new, imgs, variants } = data;
        const newProductId = await Product.create({ name, description, category_id, is_new, imgs, variants });
        return newProductId;
    }

    // 更新產品
    static async update(id, data) {
        const existingProduct = await Product.getById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        await Product.update(id, data);
        return id;
    }

    // 刪除產品
    static async delete(id) {
        const existingProduct = await Product.getById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        await Product.delete(id);
        return id;
    }
}

module.exports = ProductService;
