// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const { verifyRecaptchaResponse } = require("../recaptcha");
const { updateBankroll, checkBankroll, initializeBankroll } = require('../bankroll');

const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");
const fs = require('fs');
const ProvablyFair = require("../../models/ProvablyFair");

const User = require("../../models/User");
const seedrandom = require("seedrandom");
const { getConversionRate } = require('../../utils/currencyUtils'); // Import the new function

const crypto = require("crypto");
const BetHistory = require("../../models/BetHistory");


// Get socket.io instance
const listen = async (io) => {
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Listen for new websocket connections
  io.of("/limbo").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connections
    socket.use(throttlerController(socket));
    
    function generateRandomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    
    async function handlelimbo(amount, multiplier, currency) {
      try {
        if (!user || !user._id) {
          return socket.emit(
            "game-creation-error",
            "You are not logged in!"
          );
       }
       const conversionRate = getConversionRate(currency); // Use the imported function
   
       if (!conversionRate) {
         return socket.emit(
           "game-creation-error",
           "Currency conversion rate not found!"
         );
       }
       const amountInUSD = amount * conversionRate;

        const foundUser = await User.findOne({ _id: user._id });
        const userBalance = foundUser.wallet[currency].balance;

// Check if the user's wallet for the specified currency exists and log the balance


    if (!foundUser || !foundUser.wallet[currency]) {
      throw new Error(`Wallet for ${currency} does not exist!`);
    }

        console.log(`Balance for ${currency}:`, userBalance);
    
        // Check if the balance is zero or negative
        if (userBalance <= 0) {
          throw new Error('Insufficient balance');
        }
    
        // Ensure the user can afford the bet
        if (userBalance < amount) {
          return socket.emit("game-creation-error", "You can't afford this bet!");
        }
    
        if (multiplier < 1.01) {
          return socket.emit(
            "game-creation-error",
            "Multiplier can't be lower than 1.01"
          );
        }
                 // Access and log the balance for the specific currency


        const { minBetAmount, maxBetAmount } = config.games.limbo;
        if (
          amount < minBetAmount ||
          amount > maxBetAmount
        ) {
          return socket.emit(
            "game-creation-error",
            `Your bet must be a minimum of ${minBetAmount} dls and a maximum of ${maxBetAmount} dls!`
          );
        }
        if (!loggedIn) {
          return socket.emit(
            "game-creation-error",
            "You are not logged in!"
          );
        }
        if(isNaN(amount) || amount <= 0) {
          return socket.emit(
            "game-creation-error",
            "Invalid Amount"
          );
        }
        const generatePrivateSeed = async () => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(256, (error, buffer) => {
              if (error) reject(error);  
              else resolve(buffer.toString("hex"));
            });
          });
        };
        
        // Hash an input (private seed) to SHA256
        const buildPrivateHash = async seed => {
          return new Promise((resolve, reject) => {
            try {
              const hash = crypto.createHash("sha256").update(seed).digest("hex");
        
              resolve(hash);
            } catch (error) {
              reject(error);
            }
          });
        };
        const generateServerSeed = async () => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(256, (error, buffer) => {
              if (error) reject(error);
              else resolve(buffer.toString("hex"));
            });
          });
        };
        
        
        // Generate a private seed and hash pair
        const generatePrivateSeedHashPair = async () => {
          return new Promise(async (resolve, reject) => {
            try {
              const seed = await generatePrivateSeed();
              const hash = await buildPrivateHash(seed);
        
              resolve({ seed, hash });
            } catch (error) {
              reject(error);
            }
          });
        };
        
        let fairSession = await ProvablyFair.findOne({ _user: foundUser._id }).sort({ created: -1 });

        const HOUSE_EDGE = 1; // Example house edge percentage
        const MAX_MULTIPLIER = 1000000; // Example maximum multiplier
         initializeBankroll().catch(console.error);

        // Generate combined seed
        const getCombinedSeed = (serverSeed, clientSeed, nonce) => {
          return [serverSeed, clientSeed, nonce].join(":");
        };
        
        // Get number from hash
        const getNumberFromHash = (gameHash) => {
          return parseInt(gameHash.slice(0, 52 / 4), 16);
        };
        
        // Clamp the result to a specific range
        const clamp = (num, min, max) => {
          return Math.min(Math.max(num, min), max);
        };
        
// Calculate crash point
const getCrashPoint = (serverSeed, clientSeed, nonce) => {
  const combinedSeed = getCombinedSeed(serverSeed, clientSeed, nonce);
  const gameHash = crypto.createHmac('sha256', combinedSeed).digest('hex');

  const n = getNumberFromHash(gameHash);
  const e = Math.pow(2, 52);
  const num = Math.floor(((100 - HOUSE_EDGE) * e - n) / (e - n)) / 100;

  return clamp(num, 1.00, MAX_MULTIPLIER);
};

if (!fairSession) {
  throw new Error('Provably fair session not found');
}

let serverSeed = fairSession.serverSeed;
const clientSeed = fairSession.clientSeed;
let nonce = fairSession.nonce;
let crashPoint = getCrashPoint(serverSeed, clientSeed, nonce);

const bankrollAmount = await checkBankroll();


// Update fair session with the new server seed and nonce
fairSession.serverSeed = serverSeed;
fairSession.nonce += 1;
await fairSession.save();

let status, payout;
payout = amount * multiplier - amount;

console.log(nonce)
if (payout > bankrollAmount) {
  do {
    console.log(payout)
    console.log(bankrollAmount)
    serverSeed = await generatePrivateSeed();
    crashPoint = getCrashPoint(serverSeed, clientSeed, nonce);
  } while (crashPoint >= multiplier);
}

if (crashPoint > multiplier) {
  // Player wins
  status = 'WIN';
  payout = amount * multiplier - amount;

      await User.updateOne(
        { _id: user._id },
        {
          $inc: {
            [`wallet.${currency}.balance`]: +Math.abs(payout),
            wager: +Math.abs(amountInUSD),
            wagerNeededForWithdraw: -Math.abs(amountInUSD),
          }
        }
      );



socket.emit("update-wallet", {
  amount: +Math.abs(parseFloat(payout).toFixed(8)), // Ensure payout is a positive number and fixed to 8 decimals
  currency: currency // Replace with the actual currency variable
});
  insertNewWalletTransaction(user.id, -Math.abs(amount), "Limbo Play");
  insertNewWalletTransaction(user.id, +Math.abs(payout), "Limbo Win");
  await checkAndEnterRace(user.id, Math.abs(payout));
  const houseEdge = parseFloat(amount) * config.games.limbo.feePercentage;

  // Apply user's rakeback if eligible
  await checkAndApplyRakeback(user.id, houseEdge);
  await checkAndApplyAffiliatorCut(user.id, houseEdge);
  await updateBankroll(Math.abs(payout), true); // true indicates win

  // Save bet history for WIN
  const betHistory = new BetHistory({
    user: foundUser.username,
    game: "Limbo",
    betAmount: amount,
    multiplier: multiplier,
    payout: (amount * multiplier).toFixed(2),
    currency: currency,
    status: "WIN",
    timestamp: new Date().toLocaleTimeString()
  });

  await betHistory.save();

  // Emit live bet update
  io.of("/chat").emit("live-bet-update", {
    user: foundUser.username,
    game: "Limbo",
    betAmount: amount,
    multiplier: multiplier,
    payout: (amount * multiplier).toFixed(2),
    currency: currency,
    timestamp: new Date().toLocaleTimeString(),
    status: "WIN"
  });

} else {
  // Player loses
  status = 'LOSE';
  payout = 0;

      await User.updateOne(
        { _id: user._id },
        {
          $inc: {
            [`wallet.${currency}.balance`]: -Math.abs(amount),
            wager: +Math.abs(amount),
            wagerNeededForWithdraw: -Math.abs(amount),
          }
        }
      );

socket.emit("update-wallet", {
  amount: -Math.abs(parseFloat(amount).toFixed(8)),
  currency: currency
});
insertNewWalletTransaction(user.id, -Math.abs(amount), "Limbo Lose");
  await checkAndEnterRace(user.id, Math.abs(amount));
  const houseEdge = parseFloat(amount) * config.games.limbo.feePercentage;

  // Apply user's rakeback if eligible
  await checkAndApplyRakeback(user.id, houseEdge);
  await checkAndApplyAffiliatorCut(user.id, houseEdge);
  await updateBankroll(Math.abs(amount), false); // false indicates loss

  // Save bet history for LOSE
  const betHistory = new BetHistory({
    user: foundUser.username,
    game: "Limbo",
    betAmount: amount,
    multiplier: multiplier,
    payout: "0",
    currency: currency,
    status: "LOSE",
    timestamp: new Date().toLocaleTimeString()
  });

  await betHistory.save();

  // Emit live bet update
  io.of("/chat").emit("live-bet-update", {
    user: foundUser.username,
    game: "Limbo",
    betAmount: amount,
    multiplier: multiplier,
    payout: "0",
    currency: currency,
    timestamp: new Date().toLocaleTimeString(),
    status: "LOSE"
  });

  
}

// Return the result of the bet
return { payout, crashpoint: crashPoint };
} catch (error) {
// Handle errors
console.error('Error handling bet:', error);
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

    // Handling limbo bets
    socket.on("limbo:bet", async ({ amount, multiplier, currency }) => {
      try {
        const result = await handlelimbo(amount, multiplier, currency);

        socket.emit("limbo:result", result);
      } catch (error) {
        console.error(error);
        return socket.emit("limbo:error", "Error occurred while processing bet");
      }
    });
  });
};

// Export function
module.exports = {
  listen,
};
