const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isValidEmail } = require("../utils/validators");

class AuthService {
    static async register({ name, email, password, role }) {
        if (!name || !email || !password) {
            throw new Error('請提供完整資訊');
        }
        if (!isValidEmail(email)) {
            throw new Error('Email 格式不正確');
        }

        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            throw new Error('此 Email 已被註冊');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, name, role });

        return { message: '註冊成功，請登入！' };
    }

    static async login({ email, password }) {
        if (!email || !password) {
            throw new Error('請提供 Email 與密碼');
        }

        const user = await User.getByEmail(email);
        if (!user) {
            throw new Error('Email 或密碼錯誤');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Email 或密碼錯誤');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: '登入成功',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }

    static async getUserInfo(userId) {
        const user = await User.getById(userId);
        if (!user) {
            throw new Error('使用者不存在');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            role: user.role
        };
    }

    static async updateUserInfo(userId, data) {
        if (!data.name || !data.phone) {
            throw new Error('請提供姓名和電話');
        }

        const success = await User.update(userId, data);
        if (!success) {
            throw new Error('更新失敗');
        }

        return { message: '使用者資訊更新成功' };
    }
}

module.exports = AuthService;