const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// 處理未被捕獲到的錯誤
process.on('uncaughtException', (err) => {
    console.error('未被捕獲到的錯誤:', err);
    process.exit(1);
});

// 處理未處理的拒絕promise
process.on('unhandledRejection', (err) => {
    console.error('尚未處理的拒絕promise:', err);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`🚀 server運行在： http://localhost:${PORT}`);
    console.log(`📁 上傳目錄: ${process.env.UPLOAD_DIR || 'public/uploads'}`);
});

// 關閉server
process.on('SIGTERM', () => {
    console.log('準備關閉server...');
    server.close(() => {
        console.log('server已關閉');
        process.exit(0);
    });
});