// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
} = require("../random");
const { verifyRecaptchaResponse } = require("../recaptcha");

const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");
const fs = require('fs');

const User = require("../../models/User");
const seedrandom = require("seedrandom");

const CryptoJS = require("crypto-js");

// Import CandlestickData model
const CandlestickData = require("../../models/CandlestickData");
const UserOrders = require("../../models/UserOrders");

// Require ws module
const WebSocket = require('ws');
const mongoose = require('mongoose');

// Define the calculatePNL function
// Define the calculatePNL function
function calculatePNL(openOrdersData, bitcoinPrice) {
  return openOrdersData.map(order => {
    const { entryPrice, multiplier, amount, positionType } = order;
    let pnl;
    
    if (positionType === 'long') {
      // For long positions
      pnl = ((bitcoinPrice - entryPrice) / entryPrice) * 100 * multiplier;
    } else {
      // For short positions
      pnl = ((entryPrice - bitcoinPrice) / entryPrice) * 100 * multiplier;
    }

    // Round PNL to 2 decimal places
    pnl = Number(pnl.toFixed(2));

    return {
      ...order._doc,
      pnl,
      currentPrice: bitcoinPrice
    };
  });
}

// Add these calculation functions at the top of the file
const calculateProfitLong = (entryPrice, exitPrice, multiplier, betAmount) => {
  if (entryPrice === 0) return 0;
  const priceDifference = exitPrice - entryPrice;
  const profitWithLeverage = (priceDifference * betAmount * multiplier) / entryPrice;
  return Number(profitWithLeverage.toFixed(8));
};

const calculateProfitShort = (entryPrice, exitPrice, multiplier, betAmount) => {
  if (entryPrice === 0) return 0;
  const priceDifference = entryPrice - exitPrice;
  const profitWithLeverage = (priceDifference * betAmount * multiplier) / entryPrice;
  return Number(profitWithLeverage.toFixed(8));
};

// Add WebSocket connections for different cryptocurrencies
const cryptoWebSockets = {
  BTC: new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s'),
  ETH: new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1s'),
  DOGE: new WebSocket('wss://stream.binance.com:9443/ws/dogeusdt@kline_1s'),
  LTC: new WebSocket('wss://stream.binance.com:9443/ws/ltcusdt@kline_1s'),
  SOL: new WebSocket('wss://stream.binance.com:9443/ws/solusdt@kline_1s'),
  XRP: new WebSocket('wss://stream.binance.com:9443/ws/xrpusdt@kline_1s'),
  ADA: new WebSocket('wss://stream.binance.com:9443/ws/adausdt@kline_1s'),
  AVAX: new WebSocket('wss://stream.binance.com:9443/ws/avaxusdt@kline_1s')
};

// Cache for crypto prices
let cryptoPrices = {};

// Update price cache for each cryptocurrency
Object.entries(cryptoWebSockets).forEach(([symbol, ws]) => {
  ws.on('message', (data) => {
    try {
      const kline = JSON.parse(data).k;
      cryptoPrices[symbol] = parseFloat(kline.c);
    } catch (error) {
      console.error(`Error updating ${symbol} price:`, error);
    }
  });
});

// Update getCryptoPrice to use cached prices with fallback to API
async function getCryptoPrice(symbol) {
  try {
    // First try to get from cache
    if (cryptoPrices[symbol]) {
      return cryptoPrices[symbol];
    }

    // Fallback to API if not in cache
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await response.json();
    const price = parseFloat(data.price);
    
    // Update cache
    cryptoPrices[symbol] = price;
    return price;
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    throw new Error(`Failed to fetch ${symbol} price`);
  }
}

// Get socket.io instance
const listen = async (io) => {
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // WebSocket client
  const client = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
  let loggedIn = false;
  let user = null;

  const { getConversionRate } = require('../../utils/currencyUtils'); // Import currency utils

  // Aktif işlemleri takip etmek için global Set
  const processingOrders = new Set();
  // Kapatılmış orderları geçici olarak tutmak için Set
  const recentlyClosedOrders = new Set();

  // Listen for new websocket connections
  io.of("/futures").on("connection", socket => {

    // Throttle connections
    socket.use(throttlerController(socket));
    let lastBitcoinPrice = null;
    let lastPriceTimestamp = 0;
    const PRICE_CACHE_DURATION = 500; // 500ms cache süresi

    async function fetchBitcoinPrice() {
      const now = Date.now();
      if (lastBitcoinPrice && (now - lastPriceTimestamp) < PRICE_CACHE_DURATION) {
        return lastBitcoinPrice;
      }

      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        const data = await response.json();
        lastBitcoinPrice = parseFloat(data.price);
        lastPriceTimestamp = now;
        return lastBitcoinPrice;
      } catch (error) {
        console.error("Error fetching bitcoin price:", error);
        throw new Error("Failed to fetch bitcoin price");
      }
    }

    const handleBuy = async (socket, user, data) => {
      try {
        if (!data.symbol) {
          throw new Error('Trading pair symbol is required');
        }

        // Check if user has sufficient balance
        const userWallet = user.wallet[data.currency];
        if (!userWallet || userWallet.balance < data.amount) {
          throw new Error('Insufficient balance');
        }

        // Get the current price for the specific cryptocurrency
        const entryPrice = await getCryptoPrice(data.symbol);

        // Create new order with the correct entry price
        const newOrder = new UserOrders({
          user: user._id,
          amount: data.amount,
          multiplier: data.multiplier,
          bustPrice: data.bustPrice,
          entryPrice: entryPrice,
          currency: data.currency,
          currencyPurchased: data.symbol,
          positionType: data.isLong ? "long" : "short",
          status: "open",
          currentPrice: entryPrice
        });

        // Save the order
        const savedOrder = await newOrder.save();
        
        // Update user's wallet with atomic operation
        const updatedUser = await User.findOneAndUpdate(
          { 
            _id: user._id,
            [`wallet.${data.currency}.balance`]: { $gte: data.amount } // Additional check to prevent race conditions
          },
          { $inc: { [`wallet.${data.currency}.balance`]: -data.amount } },
          { new: true }
        );

        if (!updatedUser) {
          // If update failed, delete the order and throw error
          await UserOrders.deleteOne({ _id: savedOrder._id });
          throw new Error("Insufficient balance or wallet update failed");
        }

        // Get current open orders
        const currentOrders = await UserOrders.find({
          user: user._id,
          status: "open"
        })
        .sort({ createdAt: -1 })
        .limit(ORDERS_LIMIT);

        // Emit success events
        socket.emit("notify:success", "Position opened successfully");
        socket.emit("update-wallet", {
          currency: data.currency,
          amount: -data.amount,
          newBalance: updatedUser.wallet[data.currency].balance
        });
        socket.emit("openOrders:data", currentOrders);

        return savedOrder;

      } catch (error) {
        console.warn(error);
        socket.emit("notify:error", error.message || "Failed to open position");
        throw error;
      }
    };

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);
        
        // Find and verify user exists
        const foundUser = await User.findOne({ _id: decoded.user.id });
        if (!foundUser) {
          loggedIn = false;
          user = null;
          return socket.emit("error", "User not found");
        }

        // Check if user is banned
        if (parseInt(foundUser.banExpires) > new Date().getTime()) {
          loggedIn = false;
          user = null;
          return socket.emit("user banned");
        }

        // Set user and logged in status
        user = foundUser;
        loggedIn = true;
        socket.join(String(user._id));

      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify:error", "Authentication token is not valid");
      }
    });

    // Check for user's ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });

    socket.on("candlestick:sellorder", async (orderId) => {
      try {
        // Check if user is authenticated
        if (!user || !user._id) {
          throw new Error("You must be logged in to perform this action");
        }

        // Validate orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
          throw new Error('Invalid order ID');
        }

        // Check if order is already being processed
        if (processingOrders.has(orderId) || recentlyClosedOrders.has(orderId)) {
          console.log(`Order ${orderId} is already being processed or was recently closed`);
          return socket.emit("candlestick:error", "Order is already being processed");
        }

        // Mark order as processing
        processingOrders.add(orderId);

        try {
          // Find and verify the order
          const order = await UserOrders.findOne({ 
            _id: orderId,
            status: "open",
            user: user._id
          });
          
          if (!order) {
            throw new Error("Order not found or already closed");
          }

          // Get current price for the specific cryptocurrency
          const currentPrice = await getCryptoPrice(order.currencyPurchased);
          
          const finalPnl = order.positionType === 'short'
            ? calculateProfitShort(order.entryPrice, currentPrice, order.multiplier, order.amount)
            : calculateProfitLong(order.entryPrice, currentPrice, order.multiplier, order.amount);

          const totalAmountToAdd = finalPnl + order.amount;

          // Update order status
          const updatedOrder = await UserOrders.findOneAndUpdate(
            { 
              _id: orderId,
              status: "open",
              user: user._id
            },
            {
              status: "closed",
              currentPrice: currentPrice,
              pnl: finalPnl,
              closeTime: new Date(),
              exitPrice: currentPrice
            },
            { new: true }
          );

          if (!updatedOrder) {
            throw new Error("Order was already closed or modified");
          }

          // Update user's wallet
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $inc: { [`wallet.${order.currency}.balance`]: totalAmountToAdd } },
            { new: true }
          );

          if (!updatedUser) {
            throw new Error("Failed to update wallet");
          }

          // Add to recently closed orders
          recentlyClosedOrders.add(orderId);
          setTimeout(() => recentlyClosedOrders.delete(orderId), 5000);

          // Get remaining open orders
          const remainingOpenOrders = await UserOrders.find({
            user: user._id,
            status: "open"
          })
          .sort({ createdAt: -1 })
          .limit(ORDERS_LIMIT);

          // Emit success events
          socket.emit("notify:success", `Position closed with ${finalPnl > 0 ? '+' : ''}${finalPnl.toFixed(2)}% PNL`);
          socket.emit("order:sold", {
            orderId,
            pnl: finalPnl,
            totalAmount: totalAmountToAdd,
            success: true
          });
          socket.emit("update-wallet", {
            amount: totalAmountToAdd,
            currency: order.currency,
            newBalance: updatedUser.wallet[order.currency].balance
          });
          socket.emit("openOrders:data", remainingOpenOrders);

        } catch (error) {
          throw error;
        } finally {
          // Always remove from processing set
          processingOrders.delete(orderId);
        }

      } catch (error) {
        console.error("Error processing sell order:", error);
        socket.emit("candlestick:error", error.message);
        socket.emit("notify:error", "Failed to close position");
        
        if (user && user._id) {
          try {
            const currentOrders = await UserOrders.find({
              user: user._id,
              status: "open"
            })
            .sort({ createdAt: -1 })
            .limit(ORDERS_LIMIT);
            
            socket.emit("openOrders:data", currentOrders);
          } catch (err) {
            console.error("Error fetching current orders:", err);
          }
        }
      }
    });

    // Event handler for "candlestick:buyorder"
    socket.on("candlestick:buyorder", async (data) => {
      try {
        if (!user) {
          return socket.emit("notify:error", "You must be logged in to trade");
        }

        // Validate the data
        if (!data.symbol || !data.amount || !data.multiplier || !data.bustPrice || !data.entryPrice || !data.currency) {
          return socket.emit("notify:error", "Missing required trading parameters");
        }

        const order = await handleBuy(socket, user, data);
        
        // Additional success handling if needed
        
      } catch (error) {
        console.warn(error);
        socket.emit("notify:error", "Failed to process order");
      }
    });

  });

  // Sabit değişkenler
  const ORDERS_LIMIT = 50; // Maximum order sayısı
  const UPDATE_THROTTLE = 1000; // Güncelleme aralığı (ms)
  let lastUpdateTime = {};

  // WebSocket bağlantısı ve order güncelleme mantığını düzenleyelim
  client.on('message', async (data) => {
    try {
      const kline = JSON.parse(data).k;
      const bitcoinPrice = parseFloat(kline.c);

      const allOpenOrders = await UserOrders.find({ 
        status: "open"
      });

      const updates = allOpenOrders.map(async (order) => {
        try {
          // Get the current price for the specific cryptocurrency
          const currentPrice = await getCryptoPrice(order.currencyPurchased);

          const pnl = order.positionType === 'long'
            ? ((currentPrice - order.entryPrice) / order.entryPrice) * 100 * order.multiplier
            : ((order.entryPrice - currentPrice) / order.entryPrice) * 100 * order.multiplier;

          // Liquidation check
          if (pnl <= -99.9) {
            if (!processingOrders.has(order._id.toString())) {
              processingOrders.add(order._id.toString());
              
              try {
                await UserOrders.updateOne(
                  { _id: order._id },
                  {
                    status: "liquidated",
                    currentPrice: currentPrice,
                    pnl: -100,
                    closeTime: new Date(),
                    exitPrice: currentPrice
                  }
                );

                io.of("/futures").to(order.user.toString()).emit("notify:error", 
                  `Position liquidated at ${pnl.toFixed(2)}%`
                );

                // Güncel listeyi gönder
                const remainingOrders = await UserOrders.find({
                  user: order.user,
                  status: "open"
                })
                .sort({ createdAt: -1 })
                .limit(ORDERS_LIMIT);

                io.of("/futures").to(order.user.toString()).emit("openOrders:data", remainingOrders);
              } finally {
                processingOrders.delete(order._id.toString());
              }
              return;
            }
          }

          // Normal update
          await UserOrders.updateOne(
            { _id: order._id },
            { 
              $set: { 
                pnl: Number(pnl.toFixed(2)),
                currentPrice: currentPrice
              }
            }
          );

          const updatedOrders = await UserOrders.find({
            user: order.user,
            status: "open"
          })
          .sort({ createdAt: -1 })
          .limit(ORDERS_LIMIT);

          io.of("/futures").to(order.user.toString()).emit("openOrders:data", updatedOrders);
        } catch (err) {
          console.error(`Error processing order ${order._id}:`, err);
        }
      });

      await Promise.all(updates);

    } catch (error) {
      console.error("Error in WebSocket message handler:", error);
    }
  });

};

// Export function
module.exports = {
  listen,
};
