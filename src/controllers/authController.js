const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(200).json({ message: '請提供完整資訊', status: 400 });
    }

    try {
        // 檢查 email 是否已存在
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(200).json({ message: '此 Email 已被註冊', status: 400 });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 建立新會員
        await User.create({email, password: hashedPassword, name, role});

        return res.status(200).json({ message: '註冊成功，請登入！', status: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '伺服器錯誤', status: 500 });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ message: '請提供 Email 和密碼', status: 400 });
    }

    try {
        // 查詢使用者
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(200).json({ message: '帳號密碼錯誤', status: 400 });
        }

        // 驗證密碼
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = await User.getByPassword(password);
        if (!isMatch) {
            return res.status(200).json({ message: '帳號密碼錯誤', status: 400 });
        }

        // 產生 JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ 
            message: '登入成功', 
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            status: 200
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '伺服器錯誤', status: 500 });
    }
};

exports.userInfo = async (req, res) => {
    try {
        const user = await User.getById(req.user.id);
        if (!user) {
            return res.status(200).json({ message: '使用者不存在', status: 400 });
        }
        return res.status(200).json({ 
            message: "success",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            status: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '伺服器錯誤', status: 500 });
    }
}