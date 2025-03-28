const OrderService = require('../services/orderService');

// 查詢所有訂單（帶分頁）
exports.getOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const { orders, totalItems, totalPages, currentPage } = await OrderService.getOrders(page, limit);
        res.status(200).json({
            message: "Query successful.",
            status: 200,
            orders,
            totalItems,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to query the orders.', status: 500 });
    }
};

// 查詢單筆訂單
exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await OrderService.getOrderById(orderId);
        if (order) {
            res.status(200).json({
                message: "Order retrieved successfully.",
                status: 200,
                order
            });
        } else {
            res.status(404).json({ message: 'Order not found.', status: 404 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to query the order.', status: 500 });
    }
};

// 新增訂單
exports.createOrder = async (req, res) => {
    const { userId, totalPrice, status, snapshot } = req.body;

    try {
        const orderId = await OrderService.createOrder(userId, totalPrice, status, snapshot);
        res.status(201).json({
            message: 'Order created successfully.',
            status: 201,
            orderId
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create the order.', status: 500 });
    }
};

// 更新訂單狀態
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updated = await OrderService.updateOrderStatus(orderId, status);
        if (updated) {
            res.status(200).json({
                message: 'Order status updated successfully.',
                status: 200
            });
        } else {
            res.status(404).json({ message: 'Order not found.', status: 404 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update the order status.', status: 500 });
    }
};

// 刪除訂單
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const deleted = await OrderService.deleteOrder(orderId);
        if (deleted) {
            res.status(200).json({
                message: 'Order deleted successfully.',
                status: 200
            });
        } else {
            res.status(404).json({ message: 'Order not found.', status: 404 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete the order.', status: 500 });
    }
};
