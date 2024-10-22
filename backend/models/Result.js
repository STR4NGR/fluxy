const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    received5to7: { type: Number },
    received15to17: { type: Number },
    received25to27: { type: Number },
    receivedYaMarket: { type: Number },
    receivedOzonMarket: { type: Number }
});

module.exports = resultSchema;