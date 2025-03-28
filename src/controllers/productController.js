const ProductService = require('../services/productService');

// 查詢所有產品，並支持分頁
exports.getProducts = async (req, res) => {
    // {
    //     "page": 1,        // 頁碼，預設值為 1
    //     "pageSize": 10    // 每頁顯示的數量，預設為 10
    //   }
    try {
        const { page = 1, pageSize = 10 } = req.query; // 預設值為 1 和 10
        const products = await ProductService.getAll(parseInt(page), parseInt(pageSize));
        res.status(200).json({
            message: 'Products fetched successfully',
            data: products.data,
            totalCount: products.totalCount,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            status: 400
        });
    }
};

// 根據 ID 查詢單個產品
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductService.getById(productId);
        res.status(200).json({
            message: 'Product fetched successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            status: 400
        });
    }
};

// 新增產品
exports.createProduct = async (req, res) => {
    // {
    //     "name": "T-shirt No1",
    //     "description": "A comfortable cotton T-shirt--No1",
    //     "category_id": 1,
    //     "is_new": true,
    //     "variants": [
    //         {
    //             "color": "Red",
    //             "color_code": "#FF0000",
    //             "size": "M",
    //             "price": 19.99,
    //             "stock": 50,
    //             "image_url": "https://example.com/images/tshirt-red-m.jpg"
    //         },
    //         {
    //             "color": "Red",
    //             "color_code": "#FF0000",
    //             "size": "L",
    //             "price": 19.99,
    //             "stock": 35,
    //             "image_url": "https://example.com/images/tshirt-red-l.jpg"
    //         }
    //     ]
    // }
    try {
        const data = req.body;
        const productId = await ProductService.create(data);
        res.status(201).json({
            message: 'Product created successfully',
            data: productId
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            status: 400
        });
    }
};

// 更新產品
exports.updateProduct = async (req, res) => {
    // {
    //     "name": "T-shirt No1",
    //     "description": "A comfortable cotton T-shirt--No1",
    //     "category_id": 1,
    //     "is_new": true,
    //     "variants": [
    //         {
    //             "color": "Red",
    //             "color_code": "#FF0000",
    //             "size": "M",
    //             "price": 19.99,
    //             "stock": 50,
    //             "image_url": "https://example.com/images/tshirt-red-m.jpg"
    //         },
    //         {
    //             "color": "Red",
    //             "color_code": "#FF0000",
    //             "size": "L",
    //             "price": 19.99,
    //             "stock": 35,
    //             "image_url": "https://example.com/images/tshirt-red-l.jpg"
    //         }
    //     ]
    // }
    try {
        const productId = req.params.id;
        const data = req.body;
        await ProductService.update(productId, data);
        res.status(200).json({
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            status: 400
        });
    }
};

// 刪除產品
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await ProductService.delete(productId);
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            status: 400
        });
    }
};
