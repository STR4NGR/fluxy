const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    date: { type: String, required: true},
    shiftStart: { type: String, required: true},
    shiftEnd: { type: String, required: true},
});

const sellerSchema = new mongoose.Schema({
    name: { type: String, required:true },
    schedule: [shiftSchema],
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;