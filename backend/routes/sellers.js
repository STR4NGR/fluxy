import { Router } from 'express';
import Seller from '../models/Seller.js';

const router = Router();

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

// Получение всех продавцов из всех магазинов и из определенного при указании query параметра
router.get('/', async (req, res) => {
  try {
    const { userID } = req.query;
    
    if (!userID) {
      const sellers = await Seller.find();
      return res.json(sellers);
    }

    const sellers = await Seller.find({ user_id: userID }).populate("user_id");

    if (!sellers || sellers.length === 0) {
      return res.json([]);
    }

    res.json(sellers);
  } catch (error) {
    console.error(error);  // Логирование ошибки на сервере
    res.status(500).json({ message: 'Ошибка при обработке запроса' });
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

// Обновление цвета расписания
router.put('/:id/color', async (req, res) => {
  const { id } = req.params;
  const { date, color } = req.body;

  try {
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).send('Seller not found');
    }

    const shift = seller.schedule.find(s => s.date === date);
    if (shift) {
      shift.color = color;
    } else {
      seller.schedule.push({ date, color });
    }

    await seller.save();
    res.send(seller);
  } catch (error) {
    res.status(500).send('Error updating seller color');
  }
});

// Удаление продавца
router.delete('/:id', async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Продавец не найден' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Backend: Ошибка при удалении продавца:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
