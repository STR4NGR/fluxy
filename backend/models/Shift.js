import { Schema } from 'mongoose';
import overtimeSchema from './Overtime.js';

const shiftSchema = new Schema({
    date: { type: String, required: true},
    pre_shift: { type: String, enum: ['holiday', 'workday', 'soloday']},
    start_time: { type: String},
    end_time: { type: String},
    overtime: [ overtimeSchema ],
    store_id: { type: Schema.Types.ObjectId, required: true, ref: 'Store.js' },

});

export default shiftSchema;