const db = require('../config/database');

class Product {
    // 查詢所有產品，並包含分頁
    static async getAll(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const query = 'SELECT * FROM products LIMIT ?, ?';
        const [rows] = await db.query(query, [offset, pageSize]);
        return rows;
    }

    // 根據 ID 查詢產品
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    // 新增產品
    static async create(data) {
        const { name, description, category_id, is_new, variants } = data;
        const query = 'INSERT INTO products (name, description, category_id, is_new, variants) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, description, category_id, is_new, JSON.stringify(variants)]);
        return result.insertId;
    }

    // 更新產品
    static async update(id, data) {
        const { name, description, category_id, is_new, variants } = data;
        const query = 'UPDATE products SET name = ?, description = ?, category_id = ?, is_new = ?, variants = ? WHERE id = ?';
        const [result] = await db.query(query, [name, description, category_id, is_new, JSON.stringify(variants), id]);
        return result.affectedRows > 0;
    }

    // 刪除產品
    static async delete(id) {
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;
