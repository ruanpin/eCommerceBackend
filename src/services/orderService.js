const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

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

    static async createOrder_member(userId, cartItemIds) {
        // Step 1: 查詢 cart_items 表中的商品資料
        const cartItems = await Cart.getCartItemsByIds(userId, cartItemIds);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('No valid cart items found.');
        }
        console.log(cartItems, 'cartItems');

        // Step 2: 計算總價
        const totalPrice = cartItems.reduce((total, item) => {
            const productVariants = JSON.parse(item.variants);
            const productPrice = productVariants.find(variant => 
                variant.color === item.color && variant.size === item.size)?.price;
            return total + (productPrice * item.quantity);
        }, 0);

        if (isNaN(totalPrice)) {
            throw new Error('Out of stock');
        }

        // Step 3: 創建訂單的 snapshot
        const snapshot = JSON.stringify(cartItems.map(item => ({
            productId: item.product_id,
            name: item.name,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: JSON.parse(item.variants).find(variant => 
                variant.color === item.color && variant.size === item.size)?.price,
            imgs: JSON.parse(item.imgs)
        })));

        // Step 4: 呼叫 Model 創建訂單
        const orderId = await Order.createOrder_member(userId, totalPrice, 'pending', snapshot);

        // Step 5: 刪除原有購物車中商品
        for (const item of cartItems) {
            // 直接刪除這次購買商品在購物車中的數據
            await Cart.deleteItem(item.id);
        }

        //Step 6: 去Product table中找商品庫存，將原有庫存減去這次購買數量
        for (const item of cartItems) {
            const product = await Product.getById(item.product_id);  // 查詢商品資訊
            const productVariants = JSON.parse(product.variants);
            const variant = productVariants.find(variant => 
                variant.color === item.color && variant.size === item.size);
    
            if (variant) {
                const newStock = variant.stock - item.quantity;
    
                if (newStock < 0) {
                    throw new Error('Not enough stock for product: ' + item.name);
                }
    
                // 更新庫存
                variant.stock = newStock;
    
                // 更新該商品的庫存信息
                await Product.update(item.product_id, {
                    name: product.name,
                    description: product.description,
                    category_id: product.category_id,
                    is_new: product.is_new,
                    variants: productVariants  // 更新後的 variants
                });
            }
        }
        return orderId;
    }

    static async getOrders_member(userId, page, limit) {
        return await Order.getOrdersWithPagination_member(userId, page, limit);
    }

    static async updateOrderStatus_member(orderId, userId, status) {
        return await Order.updateOrderStatus_member(orderId, userId, status);
    }
}

module.exports = OrderService;
