const mongoose = require("mongoose");

const BetHistorySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  betAmount: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  },
  payout: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["WIN", "LOSE"],
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BetHistory", BetHistorySchema); 