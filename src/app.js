const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
// const bannerRoutes = require('./routes/bannerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // 記錄請求日誌

// 路由設定
app.use('/api/auth', authRoutes);
// app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 404 
app.use((req, res) => {
    res.status(404).json({ error: '404找不到此路徑' });
});

// 錯誤處理
app.use((err, req, res, next) => {
    console.error('錯誤詳情:', err);
    
    // JWT error handler
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            error: '無效的token',
            details: err.message 
        });
    }

    // DB error handler
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
            error: '數據重複',
            details: err.message 
        });
    }

    res.status(500).json({ 
        error: '伺服器發生錯誤',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
