import { Schema } from 'mongoose';

const overtimeSchema = new Schema({
    date: { type: String, required: true},
    is_overtime: { type: Boolean, default: false }, 
    hours: { type: Number }
});

export default overtimeSchema;