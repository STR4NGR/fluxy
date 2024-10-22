const mongoose = require('mongoose');
const shiftSchema = require('./Shift');
const resultSchema = require('./Result');

const sellerSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required:true },
    schedule: [shiftSchema],
    result: resultSchema
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;