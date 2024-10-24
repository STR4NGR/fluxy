const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { email, name, password, role } = req.body; 
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }
        const user = new User({ email, name, password: hashedPassword, role }); 
        await user.save();
        
        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован.', errorType: 'success', token });
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
            res.json({ token, name: user.name });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Защищенный маршрут для получения имени из токена
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Извлекаем токен из заголовка
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Декодируем токен
      res.json({ name: decoded.name, email: decoded.email, role: decoded.role });
    } catch (err) {
      res.status(400).json({ message: 'Неверный токен' });
    }
  });

module.exports = router;

