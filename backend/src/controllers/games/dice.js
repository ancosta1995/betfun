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
const ProvablyFair = require("../../models/ProvablyFair");

const User = require("../../models/User");
const seedrandom = require("seedrandom");

const crypto = require("crypto");

const { updateBankroll, checkBankroll, initializeBankroll } = require('../bankroll');
const prices = JSON.parse(fs.readFileSync('Prices.json'));
const { getConversionRate } = require('../../utils/currencyUtils');

const BetHistory = require("../../models/BetHistory");

// Get socket.io instance
const listen = async (io) => {
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Listen for new websocket connections
  io.of("/dice").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connections
    socket.use(throttlerController(socket));

    async function handleDice(amount, multiplier, rangeData, isRollOver, currency) {
      try {
        if (!user || !user._id) {
          return socket.emit("game-creation-error", "You are not logged in!");
        }

        const conversionRate = getConversionRate(currency);
        if (!conversionRate) {
          return socket.emit("game-creation-error", "Currency conversion rate not found!");
        }

        // Parse amount to number and validate to prevent stack overflow
        amount = parseFloat(amount.toFixed(8)); // Limit decimal places
        const amountInUSD = amount * conversionRate;

        if(isNaN(amount) || isNaN(rangeData) || amount <= 0 || rangeData >= 100) {
          return socket.emit("game-creation-error", "Invalid Amount");
        }

        const foundUser = await User.findOne({ _id: user._id });
        if (!foundUser || !foundUser.wallet[currency]) {
          return socket.emit("game-creation-error", `Wallet for ${currency} does not exist!`);
        }

        const userBalance = parseFloat(foundUser.wallet[currency].balance.toFixed(8));
        if (userBalance <= 0) {
          return socket.emit("game-creation-error", "Insufficient balance");
        }

        if (userBalance < amount) {
          return socket.emit("game-creation-error", "You can't afford this bet!");
        }

        if (rangeData < 0.1) {
          return socket.emit("game-creation-error", "Range can't be lower than 1.01");
        }

        const { minBetAmount, maxBetAmount } = config.games.dice;
        if (amount < minBetAmount || amount > maxBetAmount) {
          return socket.emit(
            "game-creation-error", 
            `Your bet must be a minimum of ${minBetAmount} dls and a maximum of ${maxBetAmount} dls!`
          );
        }

        if (!loggedIn) {
          return socket.emit("game-creation-error", "You are not logged in!");
        }

        let fairSession = await ProvablyFair.findOne({ _user: foundUser._id }).sort({ created: -1 });
        if (!fairSession) {
          return socket.emit("game-creation-error", "Provably fair session not found");
        }

        const serverSeed = fairSession.serverSeed;
        const clientSeed = fairSession.clientSeed;
        const nonce = fairSession.nonce;

        const combinedSeed = [serverSeed, clientSeed, nonce].join(":");
        const gameHash = crypto.createHmac('sha256', combinedSeed).digest('hex');
        const seed = parseInt(gameHash.slice(0, 12), 16);
        const roll = Math.floor((seed % 10000) / 100) + ((seed % 100) / 100); // Gives result like 6.99, 0.99, etc

        let status;
        if (isRollOver) {
          status = roll > rangeData ? 'WIN' : 'LOSE';
        } else {
          status = roll < rangeData ? 'WIN' : 'LOSE';
        }

        // Validate multiplier against the range data to ensure correct odds
        const expectedMultiplier = isRollOver ? 
          parseFloat((100 / (100 - rangeData)).toFixed(4)) : 
          parseFloat((100 / rangeData).toFixed(4));
        
        // Adjust for house edge (typical is 1% house edge)
        const houseEdgeMultiplier = 0.99; // 1% house edge
        const calculatedMultiplier = parseFloat((expectedMultiplier * houseEdgeMultiplier).toFixed(4));
        
        // Log for debugging
        console.log(`Dice bet: isRollOver=${isRollOver}, rangeData=${rangeData}, expectedMultiplier=${expectedMultiplier}, calculatedMultiplier=${calculatedMultiplier}, clientMultiplier=${multiplier}`);
        
        // Use the calculated multiplier for payout calculations to ensure fairness
        // This prevents exploits where client sends incorrect multiplier
        const effectiveMultiplier = calculatedMultiplier;

        // Calculate total payout including the bet for WIN, 0 for LOSE
        const totalPayout = status === 'WIN' ? parseFloat((amount * effectiveMultiplier).toFixed(8)) : 0;
        
        // Calculate actual profit (payout - bet amount) for WIN, -bet for LOSE
        const profit = status === 'WIN' ? totalPayout - amount : -amount;

        // Update fair session
        fairSession.nonce += 1;
        await fairSession.save();

        // Update user's wallet with the profit/loss amount
        await User.updateOne(
          { _id: user._id },
          {
            $inc: {
              [`wallet.${currency}.balance`]: profit,
              wager: amountInUSD,
              wagerNeededForWithdraw: status === 'WIN' ? -amountInUSD : -amountInUSD
            }
          }
        );

        // Emit wallet update with the profit/loss
        socket.emit("update-wallet", {
          amount: profit,
          currency: currency
        });

        // Handle transactions with a single transaction showing the net result
        if (status === 'WIN') {
          insertNewWalletTransaction(user.id, profit, "Dice Win");
        } else {
          insertNewWalletTransaction(user.id, -amount, "Dice Lose");
        }

        await checkAndEnterRace(user.id, amount);

        const houseEdge = amount * config.games.dice.feePercentage;
        await checkAndApplyRakeback(user.id, houseEdge);
        await checkAndApplyAffiliatorCut(user.id, houseEdge);

        // Save bet history for WIN or LOSE
        const betHistory = new BetHistory({
          user: user.username,
          game: "Dice",
          betAmount: amount,
          multiplier: effectiveMultiplier.toFixed(4),
          payout: status === 'WIN' ? totalPayout.toFixed(2) : (-amount).toFixed(2),
          currency: currency,
          status: status.toUpperCase(),
          timestamp: new Date().toLocaleTimeString()
        });

        await betHistory.save();

        // Emit live bet update
        io.of("/chat").emit("live-bet-update", {
          user: user.username,
          game: "Dice",
          betAmount: amount,
          multiplier: effectiveMultiplier.toFixed(4),
          payout: status === 'WIN' ? totalPayout.toFixed(2) : (-amount).toFixed(2),
          currency: currency,
          timestamp: new Date().toLocaleTimeString(),
          status: status.toUpperCase()
        });

        await updateBankroll(Math.abs(profit), status === 'WIN');

        return { 
          payout: totalPayout, 
          diceresult: roll,
          multiplier: effectiveMultiplier,
          status: status
        };

      } catch (error) {
        console.error('Error handling bet:', error);
        return socket.emit("game-creation-error", "An error occurred while processing your bet");
      }
    }

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

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
          }
        }
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

    // Handling dice bets
    socket.on("dice:bet", async ({ amount, multiplier, rangeData, isRollOver, currency }) => {
      try {
        // Parse and fix precision of inputs
        amount = parseFloat(parseFloat(amount).toFixed(8));
        multiplier = parseFloat(parseFloat(multiplier).toFixed(2));
        rangeData = parseFloat(parseFloat(rangeData).toFixed(2));
        
        console.log("Received bet data:", { amount, multiplier, rangeData, isRollOver, currency });
        const result = await handleDice(amount, multiplier, rangeData, isRollOver, currency);
        if (result) {
          socket.emit("dice:result", result);
        }
      } catch (error) {
        console.error("Error processing bet:", error);
        socket.emit("dice:error", "Error occurred while processing bet");
      }
    });
  });
};

// Export function
module.exports = {
  listen,
};
