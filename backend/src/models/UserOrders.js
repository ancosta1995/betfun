const mongoose = require("mongoose");

// Define the schema for UserOrders collection
const userOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  },
  bustPrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  pnl: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    required: true
  },
  closeTime: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  positionType: {
    type: String,
    enum: ['long', 'short'],
    default: 'long'
  },
  exitPrice: {
    type: Number
  },
  currencyPurchased: {
    type: String,
    required: true,
    enum: ['BTC', 'ETH', 'DOGE', 'LTC', 'SOL', 'XRP', 'ADA', 'AVAX']
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create and export the UserOrders model
const UserOrders = mongoose.model("UserOrders", userOrderSchema);

module.exports = UserOrders;
