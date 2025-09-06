// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const { generatePrivateSeedHashPair } = require("../random");
const { verifyRecaptchaResponse } = require("../recaptcha");
const crypto = require('crypto');

const User = require("../../models/User");
const seedrandom = require("seedrandom");

const CryptoJS = require("crypto-js");
const axios = require("axios");

// Get socket.io instance
const listen = async (io) => {

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Listen for new websocket connections
  io.of("/slots").on("connection", (socket) => {
    let loggedIn = false;
    let user = null;

    // Throttle connections
    socket.use(throttlerController(socket));

    // Function to generate a random string
    function generateRandomString(length) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    // Function to handle slot game session
    async function handleSlotGame({ game_url, currency, fiat }) {
      try {
        if (!user || !user._id) {
          return socket.emit("slots:error", "You are not logged in!");
        }

        const foundUser = await User.findOne({ _id: user._id });
        if (!foundUser) {
          throw new Error("User not found");
        }

        // Configuration for the game session
        const config = {
          "cmd": "openGame",
          "hall": "3206361",
          "domain": "https://betfun.gg",
          "exitUrl": "https://betfun.gg/close.php",
          "language": "en",
          "key": "zerobyte",
          "login": foundUser.username,
          "gameId": game_url,
          "demo": "0",
        };
         console.log("Game URL:", game_url);
         console.log("Formatted gameId:", `slots/${game_url.toString()}`);
        try {
          console.log("Sending config to API:", JSON.stringify(config, null, 2));
          const response = await axios.post('https://tbs2api.lvslot.net/API/openGame/', config, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log("Game session response:", response.data);

          // Check for specific API error format
          if (response.data.status === "fail") {
            console.error("API Error:", response.data.error);
            return socket.emit("slots:error", `API Error: ${response.data.error || 'Unknown error'}`);
          }

          if (response.status === 200) {
            if (response.data.status === "success" && response.data.content) {
              const gameData = response.data.content.game;
              const sessionData = response.data.content.gameRes;

              if (!gameData || !sessionData) {
                console.error("Invalid game session data received:", response.data);
                return socket.emit("slots:error", "Invalid game session data received");
              }

              return { launch_url: gameData.url };
            } else {
              console.error("Failed to retrieve game session:", response.data);
              return socket.emit("slots:error", response.data.error || "Failed to retrieve game session");
            }
          } else {
            console.error("Failed to retrieve game session:", response.status, response.data);
            return socket.emit("slots:error", "Failed to retrieve game session");
          }
        } catch (error) {
          console.error("Error retrieving game session:", error);
          
          // Emit appropriate error messages to the client
          if (error.response) {
            socket.emit("slots:error", `Request failed: ${error.response.data.message || 'Unknown error'}`);
          } else if (error.request) {
            socket.emit("slots:error", "No response from server.");
          } else {
            socket.emit("slots:error", error.message);
          }
          
          throw new Error("Failed to retrieve game session");
        }
      } catch (error) {
        console.error("Error handling slot game:", error);
        
        // Emit appropriate error messages to the client
        if (error.response) {
          socket.emit("slots:error", `Request failed: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          socket.emit("slots:error", "No response from server.");
        } else {
          socket.emit("slots:error", error.message);
        }
        
        throw error;
      }
    }

    // Function to handle bet writing
    async function handleWriteBet(data) {
      try {
        if (!user || !user._id) {
          return {
            status: "fail",
            error: "user_not_found"
          };
        }

        const foundUser = await User.findOne({ _id: user._id });
        if (!foundUser) {
          return {
            status: "fail",
            error: "user_not_found"
          };
        }

        // Parse bet and win amounts
        const betAmount = parseFloat(data.bet);
        const winAmount = parseFloat(data.win);
        const status = winAmount > 0 ? 'WIN' : 'LOSE';
        const multiplier = winAmount > 0 ? (winAmount / betAmount).toFixed(2) : '0';

        // Check if user has enough balance for bet
        if (foundUser.balance < betAmount) {
          return {
            status: "fail",
            error: "fail_balance"
          };
        }

        // Process bet and win
        let newBalance = foundUser.balance;
        
        // Subtract bet amount
        newBalance -= betAmount;
        
        // Add win amount if any
        if (winAmount > 0) {
          newBalance += winAmount;
        }

        // Update user balance
        await User.findOneAndUpdate(
          { _id: foundUser._id },
          { $set: { balance: newBalance } },
          { new: true }
        );

        // Save bet history
        const betHistory = new BetHistory({
          user: foundUser.username,
          game: "Slots",
          betAmount: betAmount,
          multiplier: multiplier,
          payout: status === 'WIN' ? winAmount.toFixed(2) : (-betAmount).toFixed(2),
          currency: foundUser.currency || "USD",
          status: status,
          timestamp: new Date().toLocaleTimeString()
        });

        await betHistory.save();

        // Emit live bet update
        io.of("/chat").emit("live-bet-update", {
          user: foundUser.username,
          game: "Slots",
          betAmount: betAmount,
          multiplier: multiplier,
          payout: status === 'WIN' ? winAmount.toFixed(2) : (-betAmount).toFixed(2),
          currency: foundUser.currency || "USD",
          timestamp: new Date().toLocaleTimeString(),
          status: status
        });

        // Log the transaction
        console.log(`Processed bet: ${betAmount}, win: ${winAmount}, new balance: ${newBalance}`);

        // Handle transactions
        insertNewWalletTransaction(user.id, -betAmount, `Slots ${status}`);
        if (status === 'WIN') {
          insertNewWalletTransaction(user.id, winAmount, "Slots Win");
        }

        // Apply race and rakeback
        await checkAndEnterRace(user.id, betAmount);
        const houseEdge = betAmount * config.games.slots.feePercentage;
        await checkAndApplyRakeback(user.id, houseEdge);
        await checkAndApplyAffiliatorCut(user.id, houseEdge);

        // Update bankroll
        await updateBankroll(Math.abs(status === 'WIN' ? winAmount : -betAmount), status === 'WIN');

        return {
          status: "success",
          error: "",
          login: foundUser.username,
          balance: newBalance.toFixed(2),
          currency: foundUser.currency || "USD"
        };

      } catch (error) {
        console.error("Error processing bet:", error);
        return {
          status: "fail",
          error: error.message
        };
      }
    }

    // Authenticate websocket connection
    socket.on("auth", async (token) => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit("error", "No authentication token provided, authorization declined");
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

            // Now that the user is authenticated, load in-progress games
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

    socket.on("slots:generatesession", async ({ game_url, currency, fiat }) => {
      try {
        // Call the handleSlotGame function to process the slot game
        const result = await handleSlotGame({ game_url, currency, fiat });
        
        // Emit the result to the client
        socket.emit("slots:result", result);
      } catch (error) {
        console.error(error);
        return socket.emit("slots:error", "Error occurred while processing slot game");
      }
    });

    socket.on("slots:writeBet", async (data) => {
      try {
        // Validate required parameters
        if (!data.bet || !data.win || !data.tradeId || !data.sessionId) {
          return socket.emit("slots:error", "Missing required parameters");
        }

        const result = await handleWriteBet(data);
        socket.emit("slots:betResult", result);

      } catch (error) {
        console.error("Error in writeBet handler:", error);
        socket.emit("slots:error", "Error processing bet");
      }
    });
  });
};

// Export function
module.exports = {
  listen,
};
