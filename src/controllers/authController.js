const AuthService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const response = await AuthService.register(req.body);
        return res.status(201).json({ message: response.message, status: 201 });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: 400 });
    }
};

exports.login = async (req, res) => {
    try {
        const response = await AuthService.login(req.body);
        return res.status(200).json({ ...response, status: 200 });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: 400 });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const userData = await AuthService.getUserInfo(req.user.id);
        return res.status(200).json({ message: "success", data: userData, status: 200 });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: 400 });
    }
};

exports.updateUserInfo = async (req, res) => {
    try {
        const response = await AuthService.updateUserInfo(req.user.id, req.body);
        return res.status(200).json({ message: response.message, status: 200 });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: 400 });
    }
};
