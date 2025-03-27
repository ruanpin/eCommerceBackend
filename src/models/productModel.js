const db = require('../config/database');

class Product {
    static async getAll(page, limit, filters) {
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const values = [];

        if (filters.category_id) {
            query += ' AND p.category_id = ?';
            values.push(filters.category_id);
        }
        if (filters.gender) {
            query += ' AND p.gender = ?';
            values.push(filters.gender);
        }
        if (filters.is_new !== undefined) {
            query += ' AND p.is_new = ?';
            values.push(filters.is_new);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        values.push(limit, (page - 1) * limit);

        const [rows] = await db.query(query, values);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async create(data) {
        const [result] = await db.query(
            `INSERT INTO products 
            (name, description, price, stock, category_id, gender, image_url, is_new) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name, data.description, data.price, data.stock, 
                data.category_id, data.gender, data.image_url, data.is_new
            ]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const allowedFields = [
            'name', 'description', 'price', 'stock',
            'category_id', 'gender', 'image_url', 'is_new'
        ];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (updates.length === 0) return false;

        values.push(id);
        const [result] = await db.query(
            `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;