import { Schema, model } from 'mongoose';
import createShop from '../middleware/store.js';

const userSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/.+@.+\..+/, 'Введите действительный email адрес!'] 
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
});

userSchema.pre('save', createShop);

export default model('User', userSchema);