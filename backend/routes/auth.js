const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { email, name, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message:  'Пользователь с таким email уже существует.'});
        }
        const user = new User({ email, name, password: hashedPassword, role: 'seller' });
        await user.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован.', errorType: 'success' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Аутентификация пользователя
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Неверные учетные данные или пользователь не найден' });
        } else {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.json({ token });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;

