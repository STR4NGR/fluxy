const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    date: { type: String, required: true},
    shiftStart: { type: String},
    shiftEnd: { type: String},
    preshift: { type: String, enum: ['holiday', 'workday', 'soloday']} 
});

module.exports = shiftSchema;