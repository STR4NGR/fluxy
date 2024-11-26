import { Schema } from 'mongoose';

const resultSchema = new Schema({
    month: { type: String, required: true },
    total_hours: { type: Number },
    total_shifts: { type: Number },
    points_57: { type: Number },
    points_1517: { type: Number },
    points_2527: { type: Number },
    points_yamarket: { type: Number },            
    points_ozonmarket: { type: Number }
});

export default resultSchema;