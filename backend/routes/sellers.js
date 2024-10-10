const express = require('express');
const Seller = require('../models/Seller');
const router = express.Router();

// Создание нового продавца
router.post('/', async (req, res) => {
  const newSeller = new Seller(req.body);
  try {
    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получение всех продавцов
router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновление расписания продавца
router.put('/:id', async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(seller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удаление смены
router.delete('/:id', async (req, res) => {
  try {
    await Seller.findByIdAndRemove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
