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
const MinesGame = require("../../models/Mines"); // Require the MinesGame model

// Define the grid variable globally
let grid = [];
function populateGrid() {
  const totalTiles = 40; // Change the total number of tiles to 40
  for (let i = 0; i < totalTiles; i++) {
    grid.push({ isMine: false });
  }
  // Logic to randomly place mines on the grid
}

// Call populateGrid function to initialize the grid
populateGrid();

// Get socket.io instance
const listen = async (io) => {

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };


  // Listen for new websocket connections
  io.of("/keno").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connections
    socket.use(throttlerController(socket));
    const HOUSE_EDGE = 4;
    const MAX_MULTIPLIER = 1000.00;

    function generateRandomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
                
    async function handleKeno({ selected, amount }) {
      try {
        if (!user || !user._id) {
          return socket.emit("keno:error", "You are not logged in!");
        }
    
        const foundUser = await User.findOne({ _id: user._id });
    
        if (!foundUser || foundUser.wallet <= 0 || foundUser.wallet == 0) {
          throw new Error('Insufficient balance');
        }
    
        const gameId = generateRandomString(10);
        const time = new Date();
        const status = "inprogress";
    
        // Generate 40 random numbers for the Keno game
        const randomNumbers = generateRandomNumbers(40);
    
        // Count the number of matches between selected numbers and random numbers
        const matches = countMatches(selected, randomNumbers);
    
        // Calculate the multiplier based on the number of matches
        const multiplier = calculateMultiplier(matches);
    
        // Calculate the profit based on the multiplier and the bet amount
        const profit = multiplier * amount;
    
        // Deduct the bet amount from the user's wallet
        await User.updateOne(
          { _id: foundUser },
          {
            $inc: {
              wallet: -Math.abs(amount),
              wager: +Math.abs(amount),
              wagerNeededForWithdraw: -Math.abs(amount),
            }
          }
        );
    
        // Emit the updated wallet balance to the client
        socket.emit("update-wallet", -Math.abs(amount));
    
        return { multiplier, profit };
      } catch (error) {
        console.error('Error handling Keno game:', error);
        throw error;
      }
    }
    
    // Function to generate an array of 40 random numbers
    function generateRandomNumbers(count) {
      const randomNumbers = [];
      for (let i = 1; i <= count; i++) {
        randomNumbers.push(Math.floor(Math.random() * 80) + 1);
      }
      return randomNumbers;
    }
    
    // Function to count the number of matches between selected numbers and random numbers
    function countMatches(selected, randomNumbers) {
      let matches = 0;
      for (const number of selected) {
        if (randomNumbers.includes(number)) {
          matches++;
        }
      }
      return matches;
    }
    
    // Function to calculate the multiplier based on the number of matches
    function calculateMultiplier(matches) {
      const multipliers = {
        1: [0.68, 1.8],
        2: [0, 1.96, 3.6],
        3: [0, 0, 1.5, 24],
        4: [0, 0, 2.1, 7.8, 88.6],
        5: [0, 0, 1.5, 4, 12, 292],
        6: [0, 0, 0, 1.8, 6, 100, 600],
        7: [0, 0, 0, 1.7, 3.2, 14, 200, 700],
        8: [0, 0, 0, 1.5, 2, 5, 39, 100, 800],
        9: [0, 0, 0, 1.4, 1.6, 2.3, 7, 40, 200, 900],
        10: [0, 0, 0, 1.3, 1.4, 1.5, 2.6, 10, 30, 200, 1000]
      };
    
      // Check if matches exceed the maximum number of keys in multipliers
      if (matches > Object.keys(multipliers).length) {
        matches = Object.keys(multipliers).length; // Limit matches to the maximum number of keys
      }
    
      return multipliers[matches][matches];
    }
    
              
    const generateGrid = () => {
      // Logic to generate and return the Keno grid with 40 numbers
      const grid = [];
      for (let i = 1; i <= 40; i++) {
        grid.push(i);
      }
      return grid;
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

    socket.on("keno:selectNumbers", async ({ selected, amount }) => {
      try {
        // Call the handleKeno function to process the selected numbers
        const result = await handleKeno({ selected, amount });
        
        // Emit the result to the client
        socket.emit("keno:result", result);
      } catch (error) {
        console.error(error);
        return socket.emit("keno:error", "Error occurred while processing Keno game");
      }
    });
    
      
  });
};

// Export function
module.exports = {
  listen,
};
