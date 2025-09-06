// models/Bonus.js
const mongoose = require('mongoose');

const bonusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  dailyBonus: { type: Number, default: 0 },
  weeklyBonus: { type: Number, default: 0 },
  monthlyBonus: { type: Number, default: 0 },
  dailyExpireAt: { type: Date },
  weeklyExpireAt: { type: Date },
  monthlyExpireAt: { type: Date },
  isDailyClaimed: { type: Boolean, default: false },
  isWeeklyClaimed: { type: Boolean, default: false },
  isMonthlyClaimed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Bonus', bonusSchema);
