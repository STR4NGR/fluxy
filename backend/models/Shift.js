const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    hours: { type: Number, required: true },
    dayOff: { type: Boolean, default: false },
});

module.exports = mongoose.model('Shift', shiftSchema);