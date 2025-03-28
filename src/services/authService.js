const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');
const { isValidEmail } = require("../utils/validators");

class AuthService {
    static async register({ name, email, password, role }) {
        if (!name || !email || !password) {
            throw new Error('Name, email and password field are required');
        }
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format.');
        }

        const existingUser = await Auth.getByEmail(email);
        if (existingUser) {
            throw new Error('This email is already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Auth.create({ email, password: hashedPassword, name, role });

        return { message: 'Registration successful, please log in!' };
    }

    static async login({ email, password }) {
        if (!email || !password) {
            throw new Error('Please provide your email and password.');
        }

        const user = await Auth.getByEmail(email);
        if (!user) {
            throw new Error('Incorrect email or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect email or password.');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }

    static async getUserInfo(userId) {
        const user = await Auth.getById(userId);
        if (!user) {
            throw new Error('User does not exist');
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
            throw new Error('Please provide your name and phone number.');
        }

        const success = await Auth.update(userId, data);
        if (!success) {
            throw new Error('update failed');
        }

        return { message: 'updated successfully' };
    }
}

module.exports = AuthService;