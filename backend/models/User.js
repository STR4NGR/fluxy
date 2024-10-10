const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/.+@.+\..+/, 'Введите действительный email адрес!'] 
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
});

module.exports = mongoose.model('User', userSchema);