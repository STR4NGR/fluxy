import dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import shiftRoutes from './routes/shifts.js';
import storeRoutes from './routes/stores.js';
import sellerRoutes from './routes/sellers.js';
import usersRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(json());

dotenv.config();
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.log('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    }) 
    .catch(err => console.log(err));

// Определение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
