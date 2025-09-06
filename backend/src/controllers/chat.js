// Require Dependencies
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const throttlerController = require("./throttler");
const { verifyRecaptchaResponse } = require("./recaptcha");
const config = require("../config");
const { getVipLevelFromWager } = require("./vip");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const colors = require("colors/safe");
const x = require("axios");

const { hasAlreadyChangedName, addNewChange } = require("./id_users");

const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const Trivia = require("../models/Trivia");
const Free = require("../models/Free");

const BOT_USERS_DATA = require('../data/botUsers.json');

// Declare chat state
const CHAT_STATE = [];
const RAIN_STATE = {
  active: true, // Whether rain is currently active
  joinable: false, // where the users can join the rain in it's final seconds
  prize: 0, // Prize split between players
  timeLeft: 1 * 60000, // 2 minutes till rain finishes
  players: [], // Array of UserID's who have participated in the rain
  lastRain: new Date(), // time when the last rain ended
  timeLeftToJoin: 2 * 60000,
};
const TRIVIA_STATE = {
  timeLeft: 60000, // trivia countdown 60 seconds
  countDownStarted: false,
};
let CHAT_PAUSED = false;

const GIVEAWAY_STATE = {
  active: false, 
  prize: {
    "display_name" : "Harvester",
    "game_name" : "Harvester",
    "status" : {
        "locked" : false,
        "withdrawable" : true
    },
    "thumbnail" : "https://tr.rbxcdn.com/0cf122939e784244bbbb97c07e89de1b/420/420/Model/Png",
    "uid" : "843023442384328042390",
    "value" : 3525
  },
  timeLeft: 600 * 1000, 
  players: [], 
};

let GIVEAWAY_QUE = [];

const BOT_CONFIG = {
  userCount: 50, // Changed to match the number of predefined users
  users: [], // Will be populated from JSON
  minDelay: 30000, // Increased from 4500 to 30000 (30 seconds)
  maxDelay: 120000, // Increased from 18000 to 120000 (2 minutes)
  usedMessages: new Set() // Track used messages to prevent duplicates
};

// Modified initializeBotUsers function
const initializeBotUsers = async () => {
  BOT_CONFIG.users = BOT_USERS_DATA.users.map((user, i) => ({
    username: user.username,
    avatar: `https://avatars.githubusercontent.com/u/${1000000 + i}`,
    level: user.level
  }));
};

let BOT_TIMER = null;

// Parse days, hours and minutes from ms timestamp
const parseUnixTimestamp = ms => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000)),
    daysms = ms % (24 * 60 * 60 * 1000),
    hours = Math.floor(daysms / (60 * 60 * 1000)),
    hoursms = ms % (60 * 60 * 1000),
    minutes = Math.floor(hoursms / (60 * 1000)),
    minutesms = ms % (60 * 1000),
    sec = Math.floor(minutesms / 1000);
  return "(" + days + "d " + hours + "h " + minutes + "m " + sec + "s)";
};

// Get state from outside the component
const getChatMessages = () => CHAT_STATE;
const getRainStatus = () => RAIN_STATE;
const getGiveawayStatus = () => GIVEAWAY_STATE;
const getTriviaTimeStatus = () => TRIVIA_STATE.timeLeft;
const getTriviaCountdownStatus = () => TRIVIA_STATE.countDownStarted;

// How long should user wait between messages
const slowModeBuffer = 1500; // 3 seconds = 3000ms

// Get socket.io instance
const listen = io => {
  // Bot kullanıcılarını başlat
  initializeBotUsers().then(() => {
    // Start bot messages
    sendBotMessage(io);
  });

  // Add existing intervals
  setInterval(() => {
    RAIN_STATE.prize = RAIN_STATE.prize + (Math.random() * 0.05);
    io.of("/chat").emit("rain-update-amount", RAIN_STATE.prize);
  }, 10000);

  setInterval(() => {
    if(RAIN_STATE.joinable) return
    startRainCountdown()
  }, 400000)

  const startRainCountdown = async () => {
    try {
      RAIN_STATE.joinable = true;
      io.of("/chat").emit("rain-state-changed", RAIN_STATE);

      const TIMER = setInterval(() => {
        RAIN_STATE.timeLeftToJoin -= 1000;
        if(RAIN_STATE.timeLeftToJoin <= 0) {
          endRainAndRestart();
          clearInterval(TIMER);
        } 
      }, 1000)
    } catch (error) {
      console.log("Error while starting rain countdown:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error starting this rain! Please contact site administrators!"
      );
    }
  };

  const endRainAndRestart = async () => {
    RAIN_STATE.joinable = false;
    RAIN_STATE.timeLeftToJoin = 2 * 60000;
    RAIN_STATE.lastRain = new Date();
    try {
      // Calculate profit for each participant
      const profit = RAIN_STATE.prize / RAIN_STATE.players.length;

      // Loop through each participant
      for (let index = 0; index < RAIN_STATE.players.length; index++) {
        const player = RAIN_STATE.players[index];

        // LOGS
        await User.updateOne({ _id: player }, { $inc: { wallet: profit } });
        insertNewWalletTransaction(player, profit, "Chat rain win");
        const newFree = Free({
          action: "rain",
          amount: profit,
          _user: player
        });
        await newFree.save();

        // Notify user
        io.of("/chat").to(player).emit("notify-success", `You won ${profit.toFixed(2)} coins from rain!`);
        io.of("/chat").to(player).emit("update-wallet", Math.abs(profit));
      }

      // Reset rain state
      RAIN_STATE.players = [];
      // RAIN_STATE.timeLeft = 120 * 1000;
      RAIN_STATE.prize = 0;

      // Remove rain from clients
      io.of("/chat").emit("rain-state-changed", RAIN_STATE);
      io.of("/chat").emit("rain-update-amount", RAIN_STATE.prize);
      //io.of("/chat").emit("notify-error", `Rain has ended!`);
    } catch (error) {
      console.log("Error while ending rain:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error while ending this rain! Please contact site administrators!"
      );
    }
  };

  const endCurrentGiveaway = async () => {
    const winner = GIVEAWAY_STATE.players[Math.floor(Math.random()*GIVEAWAY_STATE.players.length)];

    const dbUser = await User.findOne({ _id: String(winner) });

    let newInventory = dbUser.inventory;
    newInventory.push(GIVEAWAY_STATE.prize);

    await User.findOneAndUpdate({ _id: String(winner) }, { $set: { inventory: newInventory }});

    GIVEAWAY_STATE.active = false;
    GIVEAWAY_STATE.prize = {};
    GIVEAWAY_STATE.players = [];

    
    if(GIVEAWAY_QUE.length > 0) {
      const prize = GIVEAWAY_QUE[0].prize;
      const duration = GIVEAWAY_QUE[0].duration;
      GIVEAWAY_QUE.splice(0, 1);
      startNewGiveaway(prize, duration);
    } else {
      io.of("/chat").emit("giveaway-state-changed", GIVEAWAY_STATE);
    }
  };

  const startNewGiveaway = async (prize, duration) => {
    if (!GIVEAWAY_STATE.active) {
      GIVEAWAY_STATE.active = true;
      GIVEAWAY_STATE.timeLeft = 1000 * duration;
      GIVEAWAY_STATE.prize = prize;

      const countdown = setInterval(() => {
        GIVEAWAY_STATE.timeLeft -= 1000;

        if (GIVEAWAY_STATE.timeLeft <= 0) {
          clearInterval(countdown);
          return endCurrentGiveaway();
        }
      }, 1000);
    } else {
      GIVEAWAY_QUE.push(
        {
          prize: prize,
          duration: duration,
        }
      );
    }

    // Notify clients
    io.of("/chat").emit("giveaway-state-changed", GIVEAWAY_STATE);
  };

  // End rain (all players have joined)
  const endCurrentRain = async () => {
    // Disable joining
    RAIN_STATE.active = false;

    try {
      // Calculate profit for each participant
      const profit = RAIN_STATE.prize / RAIN_STATE.players.length;

      // Loop through each participant
      for (let index = 0; index < RAIN_STATE.players.length; index++) {
        const player = RAIN_STATE.players[index];

        // Update document
        await User.updateOne({ _id: player }, { $inc: { wallet: profit } });
        insertNewWalletTransaction(player, profit, "Chat rain win");

        // Notify user
        io.of("/chat")
          .to(player)
          .emit("notify-success", `You won $${profit.toFixed(2)} from rain!`);
        io.of("/chat").to(player).emit("update-wallet", Math.abs(profit));
      }

      // Reset rain state
      RAIN_STATE.players = [];
      RAIN_STATE.timeLeft = 120 * 1000;
      RAIN_STATE.prize = 0;

      // Remove rain from clients
      io.of("/chat").emit("rain-state-changed", RAIN_STATE);
      //io.of("/chat").emit("notify-error", `Rain has ended!`);
    } catch (error) {
      console.log("Error while ending rain:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error while ending this rain! Please contact site administrators!"
      );
    }
  };

  // Start a new rain
  const startNewRain = (prize) => {
    // If there currently is an active rain
    //if (RAIN_STATE.active) {
    //  return socket.emit("notify-error", "There is already an active rain!");
    //}

    if (!RAIN_STATE.active) {
      RAIN_STATE.active = true;
      // Start countdown
      const countdown = setInterval(() => {
        // Decrement time left
        RAIN_STATE.timeLeft -= 10;

        // Check if timer has reached 0
        if (RAIN_STATE.timeLeft <= 0) {
          clearInterval(countdown);
          return endCurrentRain();
        }
      }, 10);
    }
    // Update state
    RAIN_STATE.prize = RAIN_STATE.prize + prize;

    // Notify clients
    io.of("/chat").emit("rain-state-changed", RAIN_STATE);
  };

  // End active trivia
  const endActiveTrivia = async gameId => {
    try {
      TRIVIA_STATE.countDownStarted = false;
      TRIVIA_STATE.timeLeft = 60000; //reset trivia countdown to 60 seconds
      // Get active trivia
      const activeTrivia = await Trivia.findOne({ active: true, _id: gameId });

      // If active trivia was not found
      if (!activeTrivia) return;

      // Update document
      await Trivia.updateOne({ _id: gameId }, { $set: { active: false } });

      // Loop through winners
      for (let index = 0; index < activeTrivia.winners.length; index++) {
        const winnerId = activeTrivia.winners[index];

        // Update document
        await User.updateOne(
          { _id: winnerId },
          { $inc: { wallet: activeTrivia.prize } }
        );
        insertNewWalletTransaction(
          winnerId,
          activeTrivia.prize,
          "Chat trivia win",
          { triviaId: gameId }
        );
        const newFree = Free({
          action: "trivia",
          amount: activeTrivia.prize,
          _user: winnerId
        });
        await newFree.save();

        // Notify user
        io.of("/chat")
          .to(winnerId)
          .emit(
            "notify-success",
            `You won ${activeTrivia.prize.toFixed(2)} coins from trivia!`
          );
        io.of("/chat")
          .to(winnerId)
          .emit("update-wallet", Math.abs(activeTrivia.prize));
      }

      io.of("/chat").emit("trivia-state-changed", null);
      //io.of("/chat").emit("notify-error", `Trivia has ended.. Good luck next time!`);

      console.log(
        colors.green("Trivia >> Automatically ended trivia"),
        activeTrivia.id
      );
    } catch (error) {
      console.log("Error while ending trivia:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error while ending this trivia! Please contact site administrators!"
      );
    }
  };

  // Listen for new websocket connections
  io.of("/chat").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connnections
    socket.use(throttlerController(socket));

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
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify-success", "Successfully authenticated!");
            io.of("/chat").emit(
              "users-online",
              Object.keys(io.of("/chat").sockets).length
            );
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify-error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
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

    //const interval = setInterval(() => {           //bad practice
    // Update online users count
    io.of("/chat").emit(
      "users-online",
      Object.keys(io.of("/chat").sockets).length
    );
    //}, 1000);

    // Handle avatar change
    socket.on("set-avatar", async base64 => {
      try {
        if (base64.indexOf("data:image/jpeg;base64") === -1)
          return socket.emit("notify-error", "Invalid Image!");

        const dbUser = await User.findOne({ _id: user.id });

        if (Date.now() - dbUser.avatarLastUpdate < 3600000) return socket.emit("notify-error", "You can change your avatar once every hour.");

        await fs.mkdirSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture`), { recursive: true });
        await fs.writeFileSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture/test.jpg`), base64.split(",")[1], { encoding: "base64" });

        var stats = fs.statSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture/test.jpg`));
        var fileSizeInBytes = stats.size;
        var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

        if (fileSizeInMegabytes > 0.4) return [
          socket.emit("notify-error", "Maximum size allowed: 0.4Mb !"),
          fs.unlinkSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture/test.jpg`)),
        ];

        fs.unlinkSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture/test.jpg`)),
          await fs.writeFileSync(path.join(__dirname, `../temp/user_profiles/${user.id}/picture/profile.jpg`), base64.split(",")[1], { encoding: "base64" });

        const IS_PRODUCTION = process.env.NODE_ENV === "production";
        const BACKEND_URL = IS_PRODUCTION
          ? config.site.backend.productionUrl
          : config.site.backend.developmentUrl;

        dbUser.avatar = BACKEND_URL + `/api/images/${user.id}`;
        dbUser.avatarLastUpdate = Date.now();

        await dbUser.save();

        socket.emit("notify-success", "Update successful. Refresh site to see new changes!");
      } catch (e) {
        console.error(e);
        socket.emit("notify-error", "Unexpected error!");
      }
    });

    // Create a new chat message
    socket.on("set-displayname", async name => {
      // Validate user input
      if (typeof name !== "string")
        return socket.emit("notify-error", "Invalid Name!");

      try {
        // Get latest user obj
        const dbUser = await User.findOne({ _id: user.id });

        if (name === dbUser.username) return socket.emit("notify-error", "You already have that name.");

        let is_banned = await hasAlreadyChangedName(String(user.id));
        if (is_banned) return socket.emit("notify-error", "You can change your name again in 1 hour.");

        dbUser.username = name.replace(".gg", "x").replace(".GG", "x").replace("CSGO", "x").replace("csgo", "x").replace(".COM", "x").replace(".com", "x").replace(".NET", "x").replace(".net", "x").replace("porn", "x").replace("PORN", "x").replace("/", "x").replace("+", "x").replace("nigga", "x").replace("nigger", "x").replace("-", "x").replace("niger", "x").replace("niga", "x").replace(".", "").substring(0, 16)

        if (dbUser.username === "") {
          dbUser.username = "Hidden User";
        }

        await dbUser.save()

        // Insert new userName change
        await addNewChange(String(user.id));

        return socket.emit("notify-success", "Successfully updated username! Refresh site to see changes");
      } catch (err) {
      }
    })

    // Create a new chat message
    socket.on("send-chat-message", async content => {
      // Validate user input
      if (typeof content !== "string")
        return socket.emit("notify-error", "Invalid Message Type!");
      if (content.trim() === "")
        return socket.emit("notify-error", "Invalid Message Length!");
      if (!loggedIn)
        return socket.emit("notify-error", "You are not logged in!");

      // More validation on the content
      if (content.length > 200) {
        return socket.emit(
          "notify-error",
          "Your message length must not exceed 200 characters!"
        );
      }

      try {
        // Get latest user obj
        const dbUser = await User.findOne({ _id: user.id });
        
        // Check config file for level
        if (+getVipLevelFromWager(dbUser.wager).name < config.games.vip.levelToChat)
          return socket.emit(
            "notify-error",
            `You need to be at least level ${config.games.vip.levelToChat} to chat!`
          );

        // Get active trivia
        const activeTrivia = await Trivia.findOne({ active: true });



        // Bot toggle command
        if (dbUser.rank >= 3) {
          if (content === ".toggle-bots") {
            if (BOT_TIMER) {
              clearTimeout(BOT_TIMER);
              BOT_TIMER = null;
              return socket.emit("notify-success", "Auto messages disabled");
            } else {
              sendBotMessage(io);
              return socket.emit("notify-success", "Auto messages enabled");
            }
          }
        }

        // If there is an active trivia
        // and user entered the right answer
        if (
          activeTrivia &&
          content.toLowerCase() === activeTrivia.answer.toLowerCase()
        ) {
          // If the user has not participated in it yet
          if (!activeTrivia.winners.includes(String(user.id))) {
            // Update document
            await Trivia.updateOne(
              { _id: activeTrivia.id },
              { $push: { winners: user.id } }
            );

            io.of("/chat").emit("trivia-join-winner", activeTrivia.winners.length + 1);

            if (activeTrivia.winners.length + 1 === 1) {
              TRIVIA_STATE.countDownStarted = true;
              io.of("/chat").emit("countdown-started-trivia", TRIVIA_STATE.timeLeft, TRIVIA_STATE.countDownStarted);
              let intervalId = setInterval(() => {
                // Decrement time left
                TRIVIA_STATE.timeLeft -= 10;

                // Check if timer has reached 0
                if (TRIVIA_STATE.timeLeft <= 0) {
                  endActiveTrivia(activeTrivia.id);
                  return clearInterval(intervalId);
                }
              }, 10);
            }

            // If user was last to join
            if (activeTrivia.winners.length + 1 === activeTrivia.winnerAmount) {
              // End active trivia
              endActiveTrivia(activeTrivia.id);
            }
          } else {
            return socket.emit(
              "notify-error",
              "You already guessed correctly and participated in this trivia!"
            );
          }
        }

        // Check for chat commands
        const args = content.split(" ");
        const command = args[0];
        const ObjectId = require('mongoose').Types.ObjectId;

        // Check self-exclusion command
        if (command.includes('/selfexclude')) {
          if (!args[1] || !args[2]) return socket.emit("notify-error", "Please enter category and duration");

          if (isNaN(args[2])) return socket.emit("notify-error", "Enter a valid number for duration");

          args[2] = +args[2] * 60 * 60 * 1000;

          if (args[2] < 15 * 60 * 1000 || args[2] > 144 * 60 * 60 * 1000) return socket.emit("notify-error", "Duration has to be at least 0.25h and at most 144h");

          if (args[1] === 'All_Modes') {
            dbUser.selfExcludes.crash = Math.max(dbUser.selfExcludes.crash, Date.now() + args[2]);
            dbUser.selfExcludes.jackpot = Math.max(dbUser.selfExcludes.jackpot, Date.now() + args[2]);
            dbUser.selfExcludes.coinflip = Math.max(dbUser.selfExcludes.coinflip, Date.now() + args[2]);
            dbUser.selfExcludes.roulette = Math.max(dbUser.selfExcludes.roulette, Date.now() + args[2]);
          } else if (args[1] === 'Crash') {
            dbUser.selfExcludes.crash = Math.max(dbUser.selfExcludes.crash, Date.now() + args[2]);
          } else if (args[1] === 'Jackpot') {
            dbUser.selfExcludes.jackpot = Math.max(dbUser.selfExcludes.jackpot, Date.now() + args[2]);
          } else if (args[1] === 'Coinflip') {
            dbUser.selfExcludes.coinflip = Math.max(dbUser.selfExcludes.coinflip, Date.now() + args[2]);
          } else if (args[1] === 'Roulette') {
            dbUser.selfExcludes.roulette = Math.max(dbUser.selfExcludes.roulette, Date.now() + args[2]);
          } else {
            return socket.emit("notify-error", "Select a self-exclusion category");
          }

          await dbUser.save();

          return socket.emit("notify-success", `You have self-excluded yourself from ${args[1]} for ${(args[2] / 60 / 60 / 1000).toFixed(1)} hours`);
        }

        // Check if user is trying to create new rain game
        if (command.includes("/tip-rain")) {
          // Validate input
          if (dbUser.wallet < parseFloat(args[1]))
            return socket.emit(
              "notify-error",
              "You don't have enough balance to tip the rain."
            );
          // check config file for level
          if (+getVipLevelFromWager(dbUser.wager).name < config.games.vip.levelToRain)
            return socket.emit(
              "notify-error",
              `You need to be at least level ${config.games.vip.levelToRain} before you can tip a rain!`
            );
          if (!args[1])
            return socket.emit(
              "notify-error",
              "Please specify the <prize>"
            );
          if (isNaN(args[1]))
            return socket.emit(
              "notify-error",
              "<prize> must be a number!"
            );
          // If transactions locked
          if (dbUser.transactionsLocked)
            return socket.emit(
              "notify-error",
              "You have the transactions locked and can't use the rain feature!"
            );
          // Check min amount: 1.00; max amount: not set
          if (args[1] < 1.00)
            return socket.emit(
              "notify-error",
              "You need to add at least $1.00 to the Rain!"
            );

          if (dbUser.wagerNeededForWithdraw > 0) 
            return socket.emit(
              "notify-error",
              `You need to wager ${dbUser.wagerNeededForWithdraw} more coins to complete this action!`
            )

          await User.updateOne(
            { _id: dbUser.id },
            { $inc: { wallet: `-${args[1]}` } }
          )

          // Insert new transaction for the rain hoster user & send new wallet update.
          insertNewWalletTransaction(user.id, `-${args[1]}`, `Tipped rain: ${args[1]}`);
          const newFree = Free({
            action: "rain-tip",
            amount: Number(args[1]),
            _user: dbUser.id
          });
          await newFree.save();

          io.of("/chat").to(dbUser.id).emit("update-wallet", -parseFloat(args[1]));
          RAIN_STATE.prize += Number(args[1]);
          io.of("/chat").emit("rain-update-amount", RAIN_STATE.prize);
          return io.of("/chat").emit("notify-success", `${dbUser.username} added ${parseFloat(args[1])} coins to the Rain!`);
        }
                
        // Check if user is trying to tip another user
        if (command.includes("/tip")) {
          if (!args[1] || !args[2])
            return socket.emit(
              "notify-error",
              "Please type enter an amount."
            );

          // Check if error
          if (!ObjectId.isValid(args[1]))
            return socket.emit(
              "notify-error",
              "Invalid UserID. Please try again."
            );

          if (isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "Type a valid number for <amount> parameter"
            );

          if (isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "Type a valid number for <amount> parameter"
            );

          args[2] = parseFloat(parseFloat(args[2]).toFixed(2));

          // Not enough balance!
          if (dbUser.wallet < parseFloat(args[2]))
            return socket.emit(
              "notify-error",
              "You don't have enough balance to send a tip to this user!"
            );


          // You can't send yourself check.
          if (dbUser.id === args[1])
            return socket.emit(
              "notify-error",
              "You can't send a tip to yourself!"
            );

          // userID doesn't exists check.
          const tipped_user = await User.findOne({ _id: args[1] });
          if (!tipped_user)
            return socket.emit(
              "notify-error",
              "This userID does not exists!"
            );

          // Check config file for level
          if (+getVipLevelFromWager(dbUser.wager).name < config.games.vip.levelToTip)
            return socket.emit(
              "notify-error",
              `You need to be at least level ${config.games.vip.levelToTip} to use tip feature!`
            );

          // Check if banned.
          let timp_ramas = dbUser.banExpires - new Date().getTime();
          if (timp_ramas > 0)
            return socket.emit(
              "notify-error",
              "You are banned from solanaspincom, you can't use the tip feature!"
            )

          if(dbUser.rank != 2) {
            // If transactions locked
            if (dbUser.transactionsLocked)    
              return socket.emit(
                "notify-error",
                "You have the transactions locked and can't use the tip feature!"
              );
          }
          
          // Check min amount: 1.00; max amount: 100.00 
          if (args[2] < 1.00 || args[2] > 100.00)
            return socket.emit(
              "notify-error",
              "You can send tips only between 1.00 - 100.00!"
            )

          if (dbUser.wagerNeededForWithdraw > 0) 
            return socket.emit(
              "notify-error",
              `You need to wager ${dbUser.wagerNeededForWithdraw} more coins to complete this action!`
            )

           // Get the current time and the time 24 hours ago
          const currentTime = new Date();
          const twentyFourHoursAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));

          // Query for tips sent by the user in the last 24 hours
          const pastTips = await Free.find({
            action: "sent-tip",
            from: dbUser.id,
            created: { $gte: twentyFourHoursAgo }
          });

          // Calculate total tips sent by the user in the last 24 hours
          const totalTipsInLast24Hours = pastTips.reduce((acc, tip) => acc + tip.amount, 0);

          // Check if sending the current tip will exceed the user's tip limit for the day
          if (totalTipsInLast24Hours + args[2] > dbUser.tipLimit)
            return socket.emit(
              "notify-error",
              `You have exceeded your tip limit for the day! Your current tip limit is ${dbUser.tipLimit}.`
            );

          // Update both users' wallet balances.
          await User.updateOne(
            { _id: args[1] },
            { $inc: { wallet: args[2] } }
          )
          await User.updateOne(
            { _id: dbUser.id },
            { $inc: { wallet: -args[2] } }
          )

          // Insert new transaction for the tipped user & send new wallet update.
          insertNewWalletTransaction(args[1], args[2], `Tip received from userID ${user.id}`);
          io.of("/chat").to(args[1]).emit("update-wallet", parseFloat(args[2]));
          const newFree = Free({
            action: "recieved-tip",
            amount: Number(args[2]),
            to: args[1],
            from: dbUser.id,
            _user: args[1]
          });
          await newFree.save();

          // Insert new transaction for the tipper user & send new wallet update.
          insertNewWalletTransaction(user.id, -args[2], `Tip sent to userID ${args[1]}`);  //EDIT HERE ASWELL FOR SECURITY
          io.of("/chat").to(dbUser.id).emit("update-wallet", -parseFloat(args[2]));
          const newFree2 = Free({
            action: "sent-tip",
            amount: Number(args[2]),
            to: args[1],
            from: dbUser.id,
            _user: dbUser.id
          });
          await newFree2.save();

          io.of("/chat").to(args[1]).emit("notify-success", `You've successfully received ${args[2]} coins from ${args[1]}!`);
          return socket.emit("notify-success", `You've successfully sent ${args[2]} coins to userID ${args[1]}!`);
        }


        // Check if user is trying to remove a message
        if (dbUser.rank >= 3 && command.includes(".remove-message")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <MessageID>");

          // Find message to see if it exists
          const message = CHAT_STATE.find(message => message.msgId === args[1]);

          // If message was not found
          if (!message) {
            return socket.emit(
              "notify-error",
              "Couldn't find any message to remove with that MessageID"
            );
          }

          // Get message index
          const messageIndex = CHAT_STATE.findIndex(
            message => message.msgId === args[1]
          );

          // Remove message from state
          CHAT_STATE.splice(messageIndex, 1);

          // Remove from local state
          io.of("/chat").emit("remove-message", args[1]);

          return socket.emit(
            "notify-success",
            "Successfully deleted a message!"
          );
        }

        // Check if user is trying to pause the chat
        if (dbUser.rank >= 3 && command.includes(".pause-chat")) {
          // Toggle local variable
          CHAT_PAUSED = !CHAT_PAUSED;

          return socket.emit(
            "notify-success",
            `Successfully ${CHAT_PAUSED ? "paused" : "enabled"} chat!`
          );
        }

        // Check if user is trying to ban a user
        if (dbUser.rank >= 3 && command.includes(".ban-user")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <UserId>");

          // Get user from DB
          const banUser = await User.findOne({ _id: args[1] });

          // If user doesn't exist
          if (!banUser) {
            return socket.emit(
              "notify-error",
              "Couldn't find any users with that UserID!"
            );
          }

          // Update document
          await User.updateOne(
            { _id: args[1] },
            { $set: { banExpires: 9999999999999 } }
          );

          return socket.emit("notify-success", "Successfully banned a user!");
        }

        // Check if user is trying to mute a user
        if (dbUser.rank >= 3 && command.includes(".mute-user")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <UserId>");

          // Get user from DB
          const muteUser = await User.findOne({ _id: args[1] });

          // If user doesn't exist
          if (!muteUser) {
            return socket.emit(
              "notify-error",
              "Couldn't find any users with that UserID!"
            );
          }

          // Update document
          await User.updateOne(
            { _id: args[1] },
            { $set: { muteExpires: 9999999999999 } }
          );

          return socket.emit("notify-success", "Successfully muted a user!");
        }

        // Check if user is muted
        if (parseInt(dbUser.muteExpires) > new Date().getTime()) {
          const timeLeft = parseInt(dbUser.muteExpires) - new Date().getTime();
          return socket.emit(
            "notify-error",
            `You are muted ${parseUnixTimestamp(timeLeft)}`
          );
        }

        // Get user's last message
        const lastMessage = CHAT_STATE.sort(
          (a, b) => b.created - a.created
        ).find(message => message.user.id === user.id);

        // If slow mode affects user
        if (
          dbUser.rank < 3 &&
          lastMessage &&
          lastMessage.created + slowModeBuffer > Date.now()
        ) {
          return socket.emit(
            "notify-error",
            "Slow down, you can only send messages every 1.5 seconds!"
          );
        }

        // If chat pause affects user
        if (CHAT_PAUSED && dbUser.rank < 3) {
          return socket.emit("notify-error", "Chat is temporarily paused!");
        }

        // Construct a new message
        const message = {
          user: {
            username: dbUser.username,
            avatar: dbUser.avatar,
            rank: dbUser.rank,
            level: getVipLevelFromWager(dbUser.wager),
            id: dbUser.id,
          },
          content,
          msgId: uuid.v4(),
          created: Date.now(),
        };

        // Add message to local state
        CHAT_STATE.push(message);

        // Broadcast message to all clients
        return io.of("/chat").emit("new-chat-message", message);
      } catch (error) {
        console.log("Error while sending a chat message:", error);
        return socket.emit(
          "notify-error",
          "Internal server error, please try again later!"
        );
      }
    });

    // Enter an active rain
    socket.on("enter-rain", async recaptchaResponse => {
      if(!loggedIn)
        return socket.emit(
          "rain-join-error",
          `Login to be able to join rain!`
        );

      const dbUser = await User.findOne({ _id: user.id });

      if (dbUser.wager < config.games.vip.wagerToJoinRain)
        return socket.emit(
          "rain-join-error",
          `You need to wager at least $${config.games.vip.wagerToJoinRain} to be able to join rain!`
        );

      // Validate user input
      if (typeof recaptchaResponse !== "string")
        return socket.emit(
          "rain-join-error",
          "Invalid ReCaptcha Response Type!"
        );
      if (!RAIN_STATE.active)
        return socket.emit(
          "rain-join-error",
          "There is currently no active rain to enter!"
        );
      if (!RAIN_STATE.joinable)
        return socket.emit(
          "rain-join-error",
          "You are unable to join rain right now!"
        );
      if (!loggedIn)
        return socket.emit("rain-join-error", "You are not logged in!");

      // Check that user hasn't entered before
      if (RAIN_STATE.players.filter(userId => userId === user.id).length > 0) {
        return socket.emit(
          "rain-join-error",
          "You have already entered this rain!"
        );
      }

      try {
        // Verify reCaptcha response
        const valid = await verifyRecaptchaResponse(recaptchaResponse);
        
        // If reCaptcha was valid
        if (valid) {
          // Add user to the players array
          RAIN_STATE.players.push(user.id);

          // Notify user
          socket.emit("rain-join-success", "Successfully joined rain!");
          io.of("/chat").emit("rain-state-changed", RAIN_STATE);
        } else {
          return socket.emit(
            "rain-join-error",
            "Your captcha wasn't valid, please try again later!"
          );
        }
      } catch (error) {
        console.log(
          "Error while validating reCaptcha response for rain:",
          error
        );
        return socket.emit(
          "rain-join-error",
          "Couldn't join this rain: Internal server error, please try again later!"
        );
      }
    });

    socket.on("join-giveaway", async (recaptchaResponse) => {
      try {
        const dbUser = await User.findOne({ _id: user.id });

        if (dbUser.wager < 10000)
          return socket.emit("giveaway-join", `You need to wager 10,000 value to join any giveaways!`);

        // Validate user input
        if (typeof recaptchaResponse !== "string")
          return socket.emit(
            "giveaway-join",
            "Invalid ReCaptcha Response Type!"
          );
        if (!GIVEAWAY_STATE.active)
          return socket.emit(
            "giveaway-join",
            "There is currently no active giveaway to enter!"
          );
        if (!loggedIn)
          return socket.emit("join-giveaway", "You are not logged in!");

        // Check that user hasn't entered before
        if (GIVEAWAY_STATE.players.filter(userId => userId === user.id).length > 0) {
          return socket.emit(
            "giveaway-join",
            "You have already entered this giveaway!"
          );
        }

        const valid = await verifyRecaptchaResponse(recaptchaResponse);
        
        // If reCaptcha was valid
        if (valid) {
          // Add user to the players array
          GIVEAWAY_STATE.players.push(user.id);

          // Notify user
          socket.emit("notify-success", "Successfully joined giveaway!");
          io.of("/chat").emit("giveaway-state-changed", GIVEAWAY_STATE);
        } else {
          return socket.emit(
            "giveaway-join",
            "Your captcha wasn't valid, please try again later!"
          );
        }
        socket.emit("giveaway-join");
      } catch (error) {
        console.log("Error while joining giveaway:", error);
        return socket.emit("notify-error", "Couldn't join giveaway: Internal server error, please try again later!");
      }
    })

    socket.on("create-giveaway", async (item, duration) => {
      try {
        if (!loggedIn)
          return socket.emit("join-giveaway", "You are not logged in!");

        if(typeof Number(duration) != "number") 
          return socket.emit("notify-error", "Invalid duration type!");

        if(duration < 60) 
          return socket.emit("notify-error", "Duration must be a minimum of 1 minute (60 seconds).");

        if(duration > 1800)
          return socket.emit("notify-error", "Duration can not be a greator than 30 minutes (1800 seconds).");

        delete item.selected;
     
        const dbUser = await User.findOne({ _id: user.id});
        let newInventory = dbUser.inventory;
        const index = newInventory.findIndex(list => item.uid == list.uid);

        if(index < 0) 
          return socket.emit("notify-error", "You do not have this item.");

        newInventory.splice(index, 1);

        await User.findOneAndUpdate({ _id: dbUser._id}, { $set: { inventory: newInventory }});

        startNewGiveaway(item, duration);    
        socket.emit("notify-success", "Successfully started giveaway!");
      } catch (error) {
        console.log("Error while creating giveaway:", error);
        return socket.emit("notify-error", "Couldn't start giveaway: Internal server error, please try again later!");
      }
    })

    // User disconnects
    socket.on("disconnect", () => {
      // Update online users count
      io.of("/chat").emit(
        "users-online",
        Object.keys(io.of("/chat").sockets).length
      );
    });
  });
};

// Define common phrases at the module level
const CHAT_PHRASES = [
  "just hit 500$",
  "wen withdraw",
  "anyone won today?",
  "this site legit?",
  "lost everything fml",
  "need 1 more hit",
  "withdraw pending wtf",
  "ez money today",
  "slots r rigged",
  "anyone got promo?",
  "how long withdraw take",
  "im down bad",
  "finally some profit",
  "trust site?",
  "cant stop now",
  "one more spin",
  "rip my money",
  "help im addicted lol",
  "40k wager left fml",
  "anyone hit on gates?",
  "sup chat",
  "gm degens",
  "down bad today",
  "2x today already",
  "slots not hitting",
  "anyone wanna flip?",
  "need one more bonus",
  "this slot dead af",
  "im so tilted rn",
  "finally bonus",
  "rip balance",
  "gg wp",
  "sheesh",
  "gm",
  "gl",
  "wen moon",
  "nice",
];

const generateAIResponse = async (recentMessages) => {
  try {
    const GEMINI_API_KEY = "AIzaSyDCw5PCsMxU9qmQshhUuLKFMKbXFZbCO84";
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000);

    // 40% chance to skip API call and use local generation
    if (Math.random() < 0.4) {
      return generateLocalResponse(recentMessages);
    }

    let retries = 2;
    let response;
    
    while (retries > 0) {
      try {
        const randomPhrase = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)];
        response = await x.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
          contents: [{
            parts: [{
              text: `You're a casino chat regular. Keep it super casual and short. Sometimes reply to others, sometimes just random comments. Use chat slang. Max 2-4 words usually. Example responses: "${randomPhrase}". Recent messages: ${recentMessages.map(m => m.content).join(' | ')}. Reply naturally like in a busy chat room.`
            }]
          }],
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 20,
          }
        });
        
        if (response?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          let text = response.data.candidates[0].content.parts[0].text;
          text = text.replace(/As a/gi, '')
                    .replace(/I am/gi, 'im')
                    .replace(/Hello/gi, 'sup')
                    .replace(/!!+/g, '')
                    .replace(/\b(please|thank you|thanks)\b/gi, '')
                    .replace(/\s+/g, ' ')
                    .trim();
          
          text = text.split(' ').slice(0, 4).join(' ');
          return text;
        }
        throw new Error('Invalid API response structure');
        
      } catch (err) {
        console.error('API request error:', err.message);
        retries--;
        
        if (err.response?.status === 429) {
          const waitTime = (3 - retries) * 10000;
          console.log(`Rate limited, retries left: ${retries}. Waiting ${waitTime/1000}s...`);
          await delay(waitTime);
          continue;
        }
        
        if (retries === 0) {
          console.log('All API retries failed, using fallback response');
          return generateLocalResponse(recentMessages);
        }
      }
    }

    return generateLocalResponse(recentMessages);

  } catch (error) {
    console.error('Error in generateAIResponse:', error.message);
    return generateLocalResponse(recentMessages);
  }
};

const generateLocalResponse = (recentMessages) => {
  try {
    const contextualPhrases = [];
    const messageTexts = recentMessages.map(m => m.content || '').join(' ').toLowerCase();
    
    if (messageTexts.includes('win') || messageTexts.includes('won')) {
      contextualPhrases.push('gratz', 'lucky af', 'share some luck');
    }
    
    if (messageTexts.includes('lose') || messageTexts.includes('lost')) {
      contextualPhrases.push('rip', 'same here', 'feels bad');
    }
    
    if (messageTexts.includes('bonus')) {
      contextualPhrases.push('need bonus too', 'bonus hunt?');
    }
    
    const allPhrases = [...CHAT_PHRASES, ...contextualPhrases];
    const randomPhrase = allPhrases[Math.floor(Math.random() * allPhrases.length)];
    let text = randomPhrase;
    
    if (Math.random() < 0.2) {
      const emojis = ['🔥', '💰', '🎰', '😂', '👍', '🤑', '😭', '🙏', '💀', '👀'];
      text += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    return text;
  } catch (error) {
    console.error('Error in generateLocalResponse:', error.message);
    return "nice"; // Fallback response if everything fails
  }
};

const sendBotMessage = async (io) => {
  try {
    const botUser = BOT_CONFIG.users[Math.floor(Math.random() * BOT_CONFIG.users.length)];
    const recentMessages = CHAT_STATE.slice(-3);
    
    let message;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    if (Math.random() < 0.6) {
      message = generateLocalResponse([]);
    } else {
      do {
        try {
          message = await generateAIResponse(recentMessages);
          attempts++;
        } catch (error) {
          console.error('Error generating AI message:', error.message);
          message = generateLocalResponse([]);
          break;
        }
      } while (BOT_CONFIG.usedMessages.has(message) && attempts < MAX_ATTEMPTS);
    }

    if (!message) {
      message = generateLocalResponse([]); // Final fallback
    }

    BOT_CONFIG.usedMessages.add(message);

    if (BOT_CONFIG.usedMessages.size > 100) {
      BOT_CONFIG.usedMessages.clear();
    }

    const botMessage = {
      user: {
        username: botUser.username,
        avatar: botUser.avatar,
        rank: 0,
        level: botUser.level,
        id: "u" + Math.random().toString(36).substring(2),
      },
      content: message,
      msgId: Math.random().toString(36).substring(2),
      created: Date.now(),
    };

    CHAT_STATE.push(botMessage);
    io.of("/chat").emit("new-chat-message", botMessage);

    const nextDelay = Math.floor(Math.random() * (BOT_CONFIG.maxDelay - BOT_CONFIG.minDelay) + BOT_CONFIG.minDelay);
    BOT_TIMER = setTimeout(() => sendBotMessage(io), nextDelay);
    
  } catch (error) {
    console.error('Error in sendBotMessage:', error.message);
    // Retry after delay if there's an error
    BOT_TIMER = setTimeout(() => sendBotMessage(io), BOT_CONFIG.maxDelay);
  }
};

// Export functions
module.exports = { listen, getChatMessages, getRainStatus, getTriviaTimeStatus, getTriviaCountdownStatus, getGiveawayStatus };
