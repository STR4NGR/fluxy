import { Schema } from 'mongoose';
import overtimeSchema from './Overtime.js';

const shiftSchema = new Schema({
    date: { type: String, required: true },
    pre_shift: { type: String, enum: ['holiday', 'workday', 'soloday'] },
    start_time: { type: String},
    end_time: { type: String},
    overtime: [ overtimeSchema ],
    user_id: { type: String, required: true },

});

export default shiftSchema;