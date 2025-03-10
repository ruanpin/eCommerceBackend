const db = require('../config/database');

class Banner {
    static async create(data) {
        const { image_url, link, is_active = true } = data;
        const [result] = await db.query(
            'INSERT INTO banners (image_url, link, is_active) VALUES (?, ?, ?)',
            [image_url, link, is_active]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query(
            'SELECT * FROM banners ORDER BY created_at DESC'
        );
        return rows;
    }

    static async getActive() {
        const [rows] = await db.query(
            'SELECT * FROM banners WHERE is_active = 1 ORDER BY created_at DESC'
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const allowedFields = ['image_url', 'link', 'is_active'];
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
            `UPDATE banners SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM banners WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Banner;