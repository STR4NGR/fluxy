import { Schema, model } from 'mongoose';
import shiftSchema from './Shift.js';
import resultSchema from './Result.js';

const sellerSchema = new Schema({
    name: { type: String, required:true },
    user_id: { type: String, required:true },
    schedule: [ shiftSchema ],
    result: [ resultSchema ]
});

export default model('Seller', sellerSchema);