const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: '未提供token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.getById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: '使用者不存在' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'token無效' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: '權限不足: 管理員' });
    }
    next();
};

exports.verifyMember = (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ error: '權限不足: 會員' });
    }
    next();
};