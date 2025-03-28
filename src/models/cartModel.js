const db = require('../config/database');

class Cart {
    // 新增商品到購物車
    static async addItem(userId, productId, quantity, color, size) {
        const query = `INSERT INTO cart_items (user_id, product_id, quantity, color, size) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [userId, productId, quantity, color, size]);
        return result.insertId;
    }

    // 更新購物車商品數量
    static async updateItem(id, quantity) {
        const query = `UPDATE cart_items SET quantity = ? WHERE id = ?`;
        const [result] = await db.execute(query, [quantity, id]);
        return result.affectedRows > 0;
    }

    // 刪除購物車商品
    static async deleteItem(id) {
        const query = `DELETE FROM cart_items WHERE id = ?`;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    // 查詢是否有相同的購物車商品
    static async findItem(userId, productId, color, size) {
        const query = `SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND color = ? AND size = ?`;
        const [items] = await db.execute(query, [userId, productId, color, size]);
        return items.length > 0 ? items[0] : null;
    }

    static async getCartItemsByUserId(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        // 直接將變數填入 SQL 查詢來測試
        const query = `
            SELECT ci.id, ci.quantity, ci.color, ci.size, 
                   p.id AS product_id, p.name, p.description, 
                   p.category_id, p.is_new, p.created_at, p.updated_at, p.variants
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ${userId}  -- 直接填入 userId
            LIMIT ${limit} OFFSET ${offset}`

        console.log("Executing query:", query);  // 打印查詢語句來檢查
        
        const [items] = await db.execute(query);  // 執行 SQL 查詢
        
        // 查詢購物車商品總數
        const countQuery = `SELECT COUNT(*) AS total FROM cart_items WHERE user_id = ${userId}`;
        const [countResult] = await db.execute(countQuery);
        const totalItems = countResult[0].total;

        return {
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        };
    }
}

module.exports = Cart;
