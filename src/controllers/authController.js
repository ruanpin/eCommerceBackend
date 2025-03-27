const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isValidEmail } = require("../utils/validators");
require('dotenv').config();
const authMiddleware = require("../middlewares/authMiddleware");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide complete information.', status: 400 });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.', status: 400 });
    }

    try {
        // 檢查 email 是否已存在
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered.', status: 400 });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 建立新會員
        await User.create({email, password: hashedPassword, name, role});

        return res.status(400).json({ message: 'Registration successful, please log in!', status: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', status: 500 });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide your email and password.', status: 400 });
    }

    try {
        // 查詢使用者
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password.', status: 400 });
        }

        // 驗證密碼
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = await User.getByPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect email or password.', status: 400 });
        }

        // 產生 JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ 
            message: 'Login successful.', 
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
        return res.status(500).json({ message: 'Server Error', status: 500 });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.getById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist.', status: 400 });
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
        return res.status(500).json({ message: 'Server Error', status: 500 });
    }
}

exports.updateUserInfo = async (req, res) => {
    try {
        const id = req.user.id;
        const {
            name,
            phone
        } = req.body;

        if (!name || !phone) return res.status(400).json({ message: 'name and phone must be provided.', status: 400 });

        const userData = {
            name,
            phone
        };

        const success = await User.update(id, userData);
        
        if (success) {
            res.status(200).json({ message: 'user info updated success.', status: 200 });
        } else {
            res.status(400).json({ message: 'user info updated fail.', status: 400 });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', status: 500 });
    }
}