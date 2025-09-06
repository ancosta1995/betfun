const mongoose = require('mongoose');

// Define the bankroll schema
const bankrollSchema = new mongoose.Schema({
  amount: { type: Number, default: 50 }, // Initial bankroll amount
  dailyProfitLoss: { type: Number, default: 0 },
  weeklyProfitLoss: { type: Number, default: 0 },
  monthlyProfitLoss: { type: Number, default: 0 },
  hourlyProfitLoss: { type: Number, default: 0 },
  totalBetAmount: { type: Number, default: 0 },
  hourlyBetAmount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

// Create the bankroll model
const Bankroll = mongoose.model('Bankroll', bankrollSchema);

// Initialize bankroll if it doesn't exist
const initializeBankroll = async () => {
  const bankroll = await Bankroll.findOne();
  if (!bankroll) {
    const newBankroll = new Bankroll();
    await newBankroll.save();
    console.log('Bankroll initialized');
  }
};

// Function to update bankroll
const updateBankroll = async (amount, isWin) => {
  const bankroll = await Bankroll.findOne();

  if (!bankroll) {
    throw new Error('Bankroll not found');
  }

  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (bankroll.lastUpdated < oneHourAgo) {
    bankroll.hourlyProfitLoss = 0;
    bankroll.hourlyBetAmount = 0;
  }

  if (bankroll.lastUpdated < oneDayAgo) {
    bankroll.dailyProfitLoss = 0;
  }

  if (bankroll.lastUpdated < oneWeekAgo) {
    bankroll.weeklyProfitLoss = 0;
  }

  if (bankroll.lastUpdated < oneMonthAgo) {
    bankroll.monthlyProfitLoss = 0;
  }

  if (isWin) {
    bankroll.amount -= amount; // Subtract the winning amount from the bankroll
    bankroll.dailyProfitLoss -= amount;
    bankroll.weeklyProfitLoss -= amount;
    bankroll.monthlyProfitLoss -= amount;
    bankroll.hourlyProfitLoss -= amount;
  } else {
    bankroll.amount += amount; // Add the losing amount to the bankroll
    bankroll.dailyProfitLoss += amount;
    bankroll.weeklyProfitLoss += amount;
    bankroll.monthlyProfitLoss += amount;
    bankroll.hourlyProfitLoss += amount;
  }
  
  bankroll.totalBetAmount += 1;
  bankroll.hourlyBetAmount += 1;
  bankroll.lastUpdated = currentTime;

  await bankroll.save();
};

// Function to check bankroll
const checkBankroll = async () => {
  const bankroll = await Bankroll.findOne();

  if (!bankroll) {
    throw new Error('Bankroll not found');
  }

  return bankroll.amount;
};

module.exports = {
  updateBankroll,
  checkBankroll,
  initializeBankroll
};
