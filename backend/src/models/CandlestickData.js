const mongoose = require('mongoose');

const candlestickDataSchema = new mongoose.Schema({
  time: Number,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
});

const CandlestickData = mongoose.model('CandlestickData', candlestickDataSchema);

module.exports = CandlestickData;
