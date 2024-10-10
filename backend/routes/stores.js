const express = require('express');
const Store = require('../models/Store');
const auth = require('../middleware/auth');
const router = express.Router();

// Создание магазина
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can create stores.' })
    }
    const { name, location } = req.body;
    const store = new Store({ 
        name,
        location,
    });
    try {
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Получение всех магазинов
router.get('/', auth, async (req, res) => {
    try {
        const stores = await Store.find();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;