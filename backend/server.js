require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const shiftRoutes = require('./routes/shifts');
const storeRoutes = require('./routes/stores');
const sellerRoutes = require('./routes/sellers');
const usersRoutes = require('./routes/users');
const initConfig = require('./config/settings');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.log('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
        initConfig();
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
