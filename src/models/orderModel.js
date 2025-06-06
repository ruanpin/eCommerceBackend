const db = require('../config/database');

class Order {
    // 取得所有訂單（帶有分頁）
    static async getOrdersWithPagination(page, limit) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT o.id, o.user_id, o.total_price, o.status, o.snapshot, u.name 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LIMIT ${limit} OFFSET ${offset}`;

        const [orders] = await db.execute(query, [limit, offset]);

        // 查詢訂單總數
        const countQuery = 'SELECT COUNT(*) AS total FROM orders';
        const [countResult] = await db.execute(countQuery);
        const totalItems = countResult[0].total;

        return {
            orders,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        };
    }

    // 取得單筆訂單
    static async getOrderById(orderId) {
        const query = `
            SELECT o.id, o.user_id, o.total_price, o.status, o.snapshot, u.username
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?`;

        const [order] = await db.execute(query, [orderId]);

        return order[0] || null;
    }

    // 新增訂單
    static async createOrder(userId, totalPrice, status, snapshot) {
        const query = `
            INSERT INTO orders (user_id, total_price, status, snapshot)
            VALUES (?, ?, ?, ?)`;

        const [result] = await db.execute(query, [userId, totalPrice, status, snapshot]);

        return result.insertId;
    }

    // 更新訂單狀態
    static async updateOrderStatus(orderId, status) {
        const query = `
            UPDATE orders
            SET status = ?
            WHERE id = ?`;

        const [result] = await db.execute(query, [status, orderId]);

        return result.affectedRows > 0;
    }

    // 刪除訂單
    static async deleteOrder(orderId) {
        const query = `
            DELETE FROM orders
            WHERE id = ?`;

        const [result] = await db.execute(query, [orderId]);

        return result.affectedRows > 0;
    }

    static async createOrder_member(userId, totalPrice, status, snapshot) {
        const sql = `INSERT INTO orders (user_id, total_price, status, snapshot) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            userId ?? null,
            totalPrice ?? null,
            status ?? null,
            snapshot ?? null
        ]);
        return result.insertId;
    }

    static async getOrdersWithPagination_member(userId, page, limit) {
        try {
            const offset = (Number(page) - 1) * Number(limit);
            const limitNum = Number(limit);
            const userIdNum = Number(userId);
            const sql = `SELECT * FROM orders WHERE user_id = ${userIdNum} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;
            const [orders] = await db.execute(sql, [userIdNum, limitNum, offset]);
            // 查詢符合條件的總筆數
            const totalSql = `SELECT COUNT(*) AS total FROM orders WHERE user_id = ?`;
            const [[{ total }]] = await db.execute(totalSql, [userIdNum]);
            return { total, orders };
        } catch (error) {
            console.error('Error executing SQL query:', error.message);
            throw new Error('Database query failed');
        }
    }

    static async updateOrderStatus_member(orderId, userId, status) {
        const sql = `UPDATE orders SET status = ? WHERE id = ? AND user_id = ?`;
        const [result] = await db.execute(sql, [status, orderId, userId]);
        return result.affectedRows > 0;
    }
}

module.exports = Order;
