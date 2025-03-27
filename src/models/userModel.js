const db = require('../config/database');

class User {
    static async create({ email, password, name, role, phone = null, address = null }) {
        const [result] = await db.query(
            'INSERT INTO users (email, password, name, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password, name, role, phone, address]
        );
        return result.insertId;
    }

    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const allowedFields = ['email', 'name', 'phone', 'address', 'is_active'];
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
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async updatePassword(id, hashedPassword) {
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = User;