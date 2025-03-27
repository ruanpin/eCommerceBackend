const Product = require('../models/productModel');

class ProductService {
    static async getAllProducts(page, limit, filters) {
        return await Product.getAll(page, limit, filters);
    }

    static async getProductById(id) {
        return await Product.getById(id);
    }

    static async createProduct(data) {
        if (!data.name || !data.price) {
            throw new Error('商品名稱和價格是必填項');
        }
        if (data.price < 0) {
            throw new Error('價格不能為負數');
        }
        if (data.stock < 0) {
            throw new Error('庫存不能為負數');
        }

        return await Product.create(data);
    }

    static async updateProduct(id, data) {
        if (data.price !== undefined && data.price < 0) {
            throw new Error('價格不能為負數');
        }
        if (data.stock !== undefined && data.stock < 0) {
            throw new Error('庫存不能為負數');
        }

        return await Product.update(id, data);
    }

    static async deleteProduct(id) {
        return await Product.delete(id);
    }
}

module.exports = ProductService;