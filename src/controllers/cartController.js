const CartService = require('../services/cartService');

// 加入商品到購物車
exports.addItem = async (req, res) => {
    const { productId, quantity, color, size, color_code } = req.body;
    const userId = req.user.id; // 這裡直接從 req.user 取得 userId

    try {
        const cartItemId = await CartService.addItemToCart(userId, productId, quantity, color, size, color_code);
        res.status(200).json({ message: 'The item has been added to the cart.', cartItemId, status: 200 });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add the item to the cart.', status: 500 });
    }
};

// 更新購物車商品數量
exports.updateItem = async (req, res) => {
    const { id, quantity } = req.body;

    try {
        const updated = await CartService.updateItemQuantity(id, { quantity });
        if (updated) {
            res.status(200).json({ message: 'The items in the cart have been updated.', status: 200 });
        } else {
            res.status(404).json({ message: 'The item could not be found.', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the item in the cart.', status: 500 });
    }
};

// 刪除購物車商品
exports.removeItem = async (req, res) => {
    const { id } = req.params;

    try {
        const removed = await CartService.removeItemFromCart(id);
        if (removed) {
            res.status(200).json({ message: 'The item has been removed from the cart.', status: 200 });
        } else {
            res.status(404).json({ message: 'The item could not be found.', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove the item from the cart.', status: 500 });
    }
};

// 查詢會員的購物車
exports.getCart = async (req, res) => {
    const userId = req.user.id; // 直接從 req.user 取得 userId
    const { page = 1, pageSize = 9999 } = req.query;

    try {
        const { items, totalItems, totalAmount, totalPages, currentPage } = await CartService.getCartItems(userId, page, pageSize);
        res.status(200).json({
            message: "Query successful.",
            status: 200,
            data: items,
            // totalItems,
            totalAmount,
            // totalPages,
            // currentPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to query the cart.', status: 500 });
    }
};
