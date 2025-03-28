const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')

class OrderService {
    // 取得所有訂單（帶有分頁）
    static async getOrders(page = 1, limit = 10) {
        return await Order.getOrdersWithPagination(page, limit);
    }

    // 取得單筆訂單
    static async getOrderById(orderId) {
        return await Order.getOrderById(orderId);
    }

    // 新增訂單
    static async createOrder(userId, totalPrice, status, snapshot) {
        // 驗證資料
        if (!totalPrice || totalPrice <= 0) {
            throw new Error("Invalid total price.");
        }
        if (!snapshot || typeof snapshot !== 'string') {
            throw new Error("Snapshot must be a valid JSON string.");
        }

        let parsedSnapshot;
        try {
            parsedSnapshot = JSON.parse(snapshot);
            if (!Array.isArray(parsedSnapshot.items)) {
                throw new Error("Snapshot must contain 'items' array.");
            }
        } catch (error) {
            throw new Error("Snapshot is not valid JSON.");
        }

        // 呼叫 model 來創建訂單
        const orderId = await Order.createOrder(userId, totalPrice, status, snapshot);
        return orderId;  // 返回新增訂單的 ID
    }

    // 更新訂單狀態
    static async updateOrderStatus(orderId, status) {
        return await Order.updateOrderStatus(orderId, status);
    }

    // 刪除訂單
    static async deleteOrder(orderId) {
        return await Order.deleteOrder(orderId);
    }
}

module.exports = OrderService;
