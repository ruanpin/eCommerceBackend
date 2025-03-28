const Cart = require('../models/cartModel');

class CartService {
    // 新增商品到購物車
    static async addItemToCart(userId, productId, quantity, color, size) {
        // 先檢查是否已存在相同商品、尺寸、顏色的購物車品項
        const existingItem = await Cart.findItem(userId, productId, color, size);

        if (existingItem) {
            // 若已存在，則累加數量
            const newQuantity = existingItem.quantity + quantity;
            await Cart.updateItem(existingItem.id, newQuantity);
            return existingItem.id; // 回傳更新的 cart_item ID
        } else {
            // 若沒有相同品項，則新增
            return await Cart.addItem(userId, productId, quantity, color, size);
        }
    }

    // 更新購物車商品數量
    static async updateItemQuantity(id, quantity) {
        return await Cart.updateItem(id, quantity);
    }

    // 刪除購物車商品
    static async removeItemFromCart(id) {
        return await Cart.deleteItem(id);
    }

    // 取得會員購物車商品（含分頁）
    static async getCartItems(userId, page = 1, limit = 10) {
        return await Cart.getCartItemsByUserId(userId, page, limit);
    }
}

module.exports = CartService;

