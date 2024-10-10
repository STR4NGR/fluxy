const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    shiftModificationHour: { type: Number, required: true, defaul: 11 },
})

module.exports = mongoose.model('Config', configSchema);