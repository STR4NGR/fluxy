import { Schema, model } from 'mongoose';

const storeSchema = new Schema({
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User.js' },
    is_mod_past : { type: Boolean, default: false }, 
    mod_time: { type: Number, default: 11 },
    shift_start: { type: Number, default: 9 },
    shift_end: { type: Number, default: 19 },
});

export default model('Store', storeSchema);