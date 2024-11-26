import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Получение всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;