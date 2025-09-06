// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit, someLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
  generateCrashRandom,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback, getVipLevelFromWager } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const { getCrashState } = require("../site-settings");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");
const { generateFakeUser, user: fakeUsers } = require("./fakeUser");
const BetHistory = require("../../models/BetHistory");

const User = require("../../models/User");
const CrashGame = require("../../models/CrashGame");

// Declare durations for game
const TICK_RATE = 150;
const START_WAIT_TIME = 4000;
const RESTART_WAIT_TIME = 9000;

// Declare growth functions
const growthFunc = ms => Math.floor(100 * Math.pow(Math.E, 0.00006 * ms));
const inverseGrowth = result => 16666.666667 * Math.log(0.01 * result);

// Declare game states
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

// Define possible levels for randomization
const POSSIBLE_LEVELS = [
  { name: 'Bronze', color: '#CD7F32', range: [1, 40] },
  { name: 'Silver', color: '#C0C0C0', range: [41, 80] },
  { name: 'Gold', color: '#FFD700', range: [81, 120] },
  { name: 'Platinum', color: '#E5E4E2', range: [121, 160] },
  { name: 'Diamond', color: '#B9F2FF', range: [161, 190] },
  { name: 'Master', color: '#FF4500', range: [191, 200] }
];

// Define word lists for username generation
const ADJECTIVES = ['Crazy', 'Lucky', 'Wild', 'Silent', 'Mystic', 'Savage', 'Royal', 'Epic', 'Golden', 'Shadow'];
const NOUNS = ['Gambler', 'Player', 'Warrior', 'Hunter', 'Knight', 'Master', 'Legend', 'Phoenix', 'Dragon', 'Wolf'];
const ACTIONS = ['Gaming', 'Betting', 'Playing', 'Winning', 'Rolling', 'Crushing', 'Rushing', 'Striking', 'Racing'];
const SUFFIXES = ['Pro', 'King', 'Boss', 'Lord', 'Master', 'Elite', 'Ace', 'Star', 'Hero', 'Champion'];

// Generate random avatar URL
const getRandomAvatar = (seed) => {
  const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'croodles', 'croodles-neutral', 'identicon', 'micah', 'miniavs', 'personas', 'pixel-art'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
};

// Generate random username
const generateUsername = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  
  // Randomly decide to use 3 or 4 words
  const useThreeWords = Math.random() > 0.5;
  
  if (useThreeWords) {
    const words = [adj, noun, suffix];
    // Randomly shuffle the three words
    return words.sort(() => Math.random() - 0.5).join('');
  } else {
    const words = [adj, noun, action, suffix];
    // Randomly shuffle the four words
    return words.sort(() => Math.random() - 0.5).join('');
  }
};

// Generate a pool of bots using fake users
const generateBotPool = () => {
  return fakeUsers.map((_, index) => {
    // Generate random level number between 1-200
    const levelNumber = Math.floor(Math.random() * 200) + 1;
    
    const botUsername = generateUsername();
    
    return {
      betId: `bot${index + 1}`,
      _id: `bot_${index + 1}`,
      username: botUsername,
      avatar: getRandomAvatar(botUsername),
      rank: Math.floor(Math.random() * 100) + 1,
      level: {
        name: `${levelNumber}`,
        number: levelNumber
      },
      betAmount: parseFloat((Math.random() * (50 - 5) + 5).toFixed(2)),
      cashoutAt: Math.random() > 0.3 ? 
        Math.floor(Math.random() * (300 - 120) + 120) :
        null,
      joinDelay: Math.floor(Math.random() * 3000) + 500,
    };
  });
};

// Initialize bot pool
const BOTS = generateBotPool();

// Declare game state
const GAME_STATE = {
  _id: null,
  status: GAME_STATES.Starting,
  crashPoint: null,
  startedAt: null,
  duration: null,
  players: {},
  pending: {},
  pendingCount: 0,
  pendingBets: [],
  privateSeed: null,
  privateHash: null,
  publicSeed: null,
  botPlayers: {},
};

// Export state to external controllers
const getCurrentGame = () => formatGame(GAME_STATE);
const getPrivateHash = () => GAME_STATE.privateSeed;

// Format a game
const formatGame = game => {
  const formatted = {
    _id: game._id,
    status: game.status,
    startedAt: game.startedAt,
    elapsed: game.startedAt ? Date.now() - new Date(game.startedAt).getTime() : 0,
    players: [
      ..._.map(game.players, p => formatPlayerBet(p)),
      ..._.map(game.botPlayers, p => formatPlayerBet(p))
    ],
    privateHash: game.privateHash,
    publicSeed: game.publicSeed,
  };

  if (game.status === GAME_STATES.Over) {
    formatted.crashPoint = game.crashPoint;
  }

  return formatted;
};

// Format a game history
const formatGameHistory = game => {
  const formatted = {
    _id: game._id,
    createdAt: game.createdAt,
    privateHash: game.privateHash,
    privateSeed: game.privateSeed,
    publicSeed: game.publicSeed,
    crashPoint: game.crashPoint / 100,
  };

  return formatted;
};

// Format a player bet
const formatPlayerBet = bet => {
  const formatted = {
    playerID: bet.playerID,
    username: bet.username,
    avatar: bet.avatar,
    betAmount: bet.betAmount,
    status: bet.status,
    level: bet.level,
  };

  if (bet.status !== BET_STATES.Playing) {
    formatted.stoppedAt = bet.stoppedAt;
    formatted.winningAmount = bet.winningAmount;
  }

  return formatted;
};

// Calculate the current game payout
const calculateGamePayout = ms => {
  const gamePayout = Math.floor(100 * growthFunc(ms)) / 100;
  return Math.max(gamePayout, 1);
};

// Get socket.io instance
const listen = io => {
  // Function to emit new player bets
  const _emitPendingBets = () => {
    const bets = GAME_STATE.pendingBets;
    GAME_STATE.pendingBets = [];

    io.of("/crash").emit("game-bets", bets);
  };

  const emitPlayerBets = _.throttle(_emitPendingBets, 600);

  // Creates a new game
  const createNewGame = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate pre-roll provably fair data
        const provablyData = await generatePrivateSeedHashPair();

        // Push game to db
        const newGame = CrashGame({
          privateSeed: provablyData.seed,
          privateHash: provablyData.hash,
          players: {},
          status: GAME_STATES.Starting,
        });

        // Save the new document
        await newGame.save();

        console.log(
          colors.cyan("Crash >> Generated new game with the id"),
          newGame._id
        );

        resolve(newGame);
      } catch (error) {
        console.log(
          colors.cyan(`Crash >> Couldn't create a new game ${error}`)
        );
      }
    });
  };

  // Starts a new game
  const runGame = async () => {
    const game = await createNewGame();

    // Override local state
    GAME_STATE._id = game._id;
    GAME_STATE.status = GAME_STATES.Starting;
    GAME_STATE.privateSeed = game.privateSeed;
    GAME_STATE.privateHash = game.privateHash;
    GAME_STATE.publicSeed = null;
    GAME_STATE.startedAt = new Date(Date.now() + RESTART_WAIT_TIME);
    GAME_STATE.players = {};

    // Update startedAt in db
    game.startedAt = GAME_STATE.startedAt;

    await game.save();

    emitStarting();
  };

  // Emits the start of the game and handles blocking
  const emitStarting = () => {
    const startedAtUnix = new Date(GAME_STATE.startedAt).getTime();
    
    // Reset bot players
    GAME_STATE.botPlayers = {};

    // Randomly select number of bots for this round (between 3 and 8)
    const botsThisRound = Math.floor(Math.random() * (8 - 3 + 1)) + 3;
    
    // Randomly select bots for this round
    const selectedBots = BOTS
      .sort(() => Math.random() - 0.5) // Shuffle array
      .slice(0, botsThisRound); // Take random subset

    // Schedule bot joins during the starting phase
    selectedBots.forEach(bot => {
      console.log(colors.cyan(`Crash >> Scheduling bot ${bot.username} to join in ${bot.joinDelay}ms`));
      
      setTimeout(() => {
        if (GAME_STATE.status === GAME_STATES.Starting) {
          console.log(colors.cyan(`Crash >> Bot ${bot.username} joining now`));
          
          GAME_STATE.botPlayers[bot.betId] = {
            playerID: bot.betId,
            _id: bot._id,
            username: bot.username,
            avatar: bot.avatar,
            rank: bot.rank,
            level: bot.level,
            betAmount: bot.betAmount,
            status: BET_STATES.Playing,
            cashoutAt: bot.cashoutAt,
            createdAt: new Date(),
          };

          // Emit bot join to clients
          io.of("/crash").emit("game-bets", [{
            playerID: bot.betId,
            username: bot.username,
            avatar: bot.avatar,
            level: bot.level,
            rank: bot.rank,
            betAmount: bot.betAmount,
            status: BET_STATES.Playing
          }]);
        }
      }, bot.joinDelay);
    });

    // Emit starting to clients
    io.of("/crash").emit("game-starting", {
      _id: GAME_STATE._id,
      privateHash: GAME_STATE.privateHash,
      timeUntilStart: RESTART_WAIT_TIME,
      startedAt: startedAtUnix,
    });

    setTimeout(blockGame, RESTART_WAIT_TIME - 500);
  };
  

  // Block games for more bets
  const blockGame = () => {
    GAME_STATE.status = GAME_STATES.Blocking;

    const loop = () => {
      const ids = Object.keys(GAME_STATE.pending);
      if (GAME_STATE.pendingCount > 0) {
        console.log(
          colors.cyan(
            `Crash >> Delaying game while waiting for ${ids.length} (${ids.join(
              ", "
            )}) join(s)`
          )
        );
        return setTimeout(loop, 50);
      }

      startGame();
    };

    loop();
  };

  // Starting animation and enabling cashouts
  const startGame = async () => {
    try {
      // Generate random data
      const randomData = await generateCrashRandom(GAME_STATE.privateSeed);

      // Overriding game state
      GAME_STATE.status = GAME_STATES.InProgress;
      GAME_STATE.crashPoint = randomData.crashPoint;
      GAME_STATE.publicSeed = randomData.publicSeed;
      GAME_STATE.duration = Math.ceil(inverseGrowth(GAME_STATE.crashPoint + 1));
      GAME_STATE.startedAt = new Date();
      GAME_STATE.pending = {};
      GAME_STATE.pendingCount = 0;

      console.log(
        colors.cyan("Crash >> Starting new game"),
        GAME_STATE._id,
        colors.cyan("with crash point"),
        GAME_STATE.crashPoint / 100
      );

      // Updating in db
      await CrashGame.updateOne(
        { _id: GAME_STATE._id },
        {
          status: GAME_STATES.InProgress,
          crashPoint: GAME_STATE.crashPoint,
          publicSeed: GAME_STATE.publicSeed,
          startedAt: GAME_STATE.startedAt,
        }
      );

      // Emiting start to clients
      io.of("/crash").emit("game-start", {
        publicSeed: GAME_STATE.publicSeed,
        crashPoint: GAME_STATE.crashPoint / 100,
      });

      callTick(0);
    } catch (error) {
      console.log("Error while starting a crash game:", error);

      // Notify clients that we had an error
      io.of("/crash").emit(
        "notify-error",
        "Our server couldn't connect to EOS Blockchain, retrying in 15s"
      );

      // Timeout to retry
      const timeout = setTimeout(() => {
        // Retry starting the game
        startGame();

        return clearTimeout(timeout);
      }, 15000);
    }
  };

  // Calculate next tick time
  const callTick = elapsed => {
    // Calculate next tick
    const left = GAME_STATE.duration - elapsed;
    const nextTick = Math.max(0, Math.min(left, TICK_RATE));

    setTimeout(runTick, nextTick);
  };

  // Run the current tick
  const runTick = () => {
    // Calculate elapsed time
    const elapsed = new Date() - GAME_STATE.startedAt;
    const at = growthFunc(elapsed);

    // Completing all auto cashouts
    runCashOuts(at);

    // Check if crash point is reached
    if (at > GAME_STATE.crashPoint) {
      endGame();
    } else {
      tick(elapsed);
    }
  };

  // Handles auto cashout for users
  const runCashOuts = elapsed => {
    // Handle real player cashouts
    _.each(GAME_STATE.players, bet => {
      // Check if bet is still active
      if (bet.status !== BET_STATES.Playing) return;

      // Check if the auto cashout is reached or max profit is reached
      if (
        bet.autoCashOut >= 101 &&
        bet.autoCashOut <= elapsed &&
        bet.autoCashOut <= GAME_STATE.crashPoint
      ) {
        doCashOut(bet.playerID, bet.autoCashOut, false, err => {
          if (err) {
            console.log(
              colors.cyan(
                `Crash >> There was an error while trying to cashout`
              ),
              err
            );
          }
        });
      } else if (
        bet.betAmount * (elapsed / 100) >= config.games.crash.maxProfit &&
        elapsed <= GAME_STATE.crashPoint
      ) {
        doCashOut(bet.playerID, elapsed, true, err => {
          if (err) {
            console.log(
              colors.cyan(
                `Crash >> There was an error while trying to cashout`
              ),
              err
            );
          }
        });
      }
    });

    // Handle bot cashouts only during game progress
    if (GAME_STATE.status === GAME_STATES.InProgress) {
      _.each(GAME_STATE.botPlayers, bot => {
        if (bot.status !== BET_STATES.Playing) return;
        
        // Add small random delay to cashout to make it more realistic
        if (bot.cashoutAt && 
            elapsed >= bot.cashoutAt && 
            elapsed <= GAME_STATE.crashPoint &&
            Math.random() > 0.1) { // 90% chance to cashout at target (10% chance to miss their target)
          
          bot.status = BET_STATES.CashedOut;
          bot.stoppedAt = bot.cashoutAt;
          bot.winningAmount = parseFloat((bot.betAmount * (bot.cashoutAt / 100)).toFixed(2));

          // Emit bot cashout to clients
          io.of("/crash").emit("bet-cashout", {
            playerID: bot.playerID,
            status: bot.status,
            stoppedAt: bot.stoppedAt,
            winningAmount: bot.winningAmount,
          });

          console.log(colors.cyan(`Crash >> Bot ${bot.username} cashed out at ${bot.stoppedAt/100}x`));
        }
      });
    }
  };

  // Handle cashout request
  const doCashOut = async (playerID, elapsed, forced, cb) => {
    console.log(colors.cyan("Crash >> Doing cashout for"), playerID);

    // Check if bet is still active
    if (GAME_STATE.players[playerID].status !== BET_STATES.Playing) return;

    // Update player state
    GAME_STATE.players[playerID].status = BET_STATES.CashedOut;
    GAME_STATE.players[playerID].stoppedAt = elapsed;
    if (forced) GAME_STATE.players[playerID].forcedCashout = true;

    const bet = GAME_STATE.players[playerID];

    // Calculate winning amount
    const winningAmount = parseFloat(
      (
        bet.betAmount *
        ((bet.autoCashOut === bet.stoppedAt ? bet.autoCashOut : bet.stoppedAt) /
          100)
      ).toFixed(2)
    );

    GAME_STATE.players[playerID].winningAmount = winningAmount;

    if (cb) cb(null, GAME_STATE.players[playerID]);

    const { status, stoppedAt } = GAME_STATE.players[playerID];

    // Emiting cashout to clients
    io.of("/crash").emit("bet-cashout", {
      playerID,
      status,
      stoppedAt,
      winningAmount,
    });

    // Giving winning balance to user
    await User.updateOne(
      { _id: playerID },
      {
        $inc: {
          [`wallet.${bet.currency}.balance`]: Math.abs(winningAmount),
        },
      }
    );

    insertNewWalletTransaction(playerID, Math.abs(winningAmount), "Crash win", {
      crashGameId: GAME_STATE._id,
      currency: bet.currency
    });

    // Update local wallet
    io.of("/crash").to(playerID).emit("update-wallet", {
      amount: Math.abs(winningAmount),
      currency: bet.currency
    });

    // Updating in db
    const updateParam = { $set: {} };
    updateParam.$set["players." + playerID] = GAME_STATE.players[playerID];
    await CrashGame.updateOne({ _id: GAME_STATE._id }, updateParam);

    // Save bet history for WIN
    const betHistory = new BetHistory({
      user: bet.username,
      game: "Crash",
      betAmount: bet.betAmount,
      multiplier: (stoppedAt / 100).toFixed(2),
      payout: (winningAmount - bet.betAmount).toFixed(2),
      currency: bet.currency,
      status: "WIN",
      timestamp: new Date().toLocaleTimeString()
    });

    await betHistory.save();

    // Emit live bet update
    io.of("/chat").emit("live-bet-update", {
      user: bet.username,
      game: "Crash",
      betAmount: bet.betAmount,
      multiplier: (stoppedAt / 100).toFixed(2),
      payout: (winningAmount).toFixed(2),
      currency: bet.currency,
      timestamp: new Date().toLocaleTimeString(),
      status: "WIN"
    });
  };

  // Handle end request
  const endGame = async () => {
    console.log(
      colors.cyan(`Crash >> Ending game at`),
      GAME_STATE.crashPoint / 100
    );

    const crashTime = Date.now();

    GAME_STATE.status = GAME_STATES.Over;
    GAME_STATE.botPlayers = {}; // Clear bot data when game ends

    // Notify clients
        io.of("/crash").emit("game-end", {
        game: formatGameHistory(GAME_STATE),
        crashPoint: GAME_STATE.crashPoint / 100, // Ensure crashPoint is divided by 100
       });

    // Run new game after start wait time
    setTimeout(() => {
      runGame();
    }, crashTime + START_WAIT_TIME - Date.now());

    // Updating in db
    await CrashGame.updateOne(
      { _id: GAME_STATE._id },
      {
        status: GAME_STATES.Over,
      }
    );

    // Inside the endGame function where players lose
    for (let playerID in GAME_STATE.players) {
      const bet = GAME_STATE.players[playerID];
      if (bet.status !== BET_STATES.CashedOut) {
        // Player loses
        insertNewWalletTransaction(bet.playerID, -Math.abs(bet.betAmount), "Crash Lose");
        await checkAndEnterRace(bet.playerID, Math.abs(bet.betAmount));
        const houseEdge = parseFloat(bet.betAmount) * config.games.crash.feePercentage;

        await checkAndApplyRakeback(bet.playerID, houseEdge);
        await checkAndApplyAffiliatorCut(bet.playerID, houseEdge);

        // Save bet history for LOSE
        const betHistory = new BetHistory({
          user: bet.username,
          game: "Crash",
          betAmount: bet.betAmount,
          multiplier: (GAME_STATE.crashPoint / 100).toFixed(2),
          payout: "0",
          currency: bet.currency,
          status: "LOSE",
          timestamp: new Date().toLocaleTimeString()
        });

        await betHistory.save();

        // Emit live bet update
        io.of("/chat").emit("live-bet-update", {
          user: bet.username,
          game: "Crash",
          betAmount: bet.betAmount,
          multiplier: (GAME_STATE.crashPoint / 100).toFixed(2),
          payout: "0",
          currency: bet.currency,
          timestamp: new Date().toLocaleTimeString(),
          status: "LOSE"
        });
      }
    }
  };

// Emits game tick to client
const tick = elapsed => {
  const startedAtUnix = new Date(GAME_STATE.startedAt).getTime();
  const currentElapsed = Date.now() - startedAtUnix;

  io.of("/crash").emit("game-tick", {
    payout: calculateGamePayout(elapsed) / 100,
    startedAt: startedAtUnix,
    elapsed: currentElapsed
  });

  callTick(elapsed);
};


  // Handle refunds of old unfinished games
  const refundGames = async games => {
    for (let game of games) {
      console.log(colors.cyan(`Crash >> Refunding game`), game._id);

      const refundedPlayers = [];

      try {
        for (let playerID in game.players) {
          const bet = game.players[playerID];

          if (bet.status == BET_STATES.Playing) {
            // Push Player ID to the refunded players
            refundedPlayers.push(playerID);

            console.log(
              colors.cyan(
                `Crash >> Refunding player ${playerID} for ${bet.betAmount}`
              )
            );

            // Refund player
            await User.updateOne(
              { _id: playerID },
              {
                $inc: {
                  wallet: Math.abs(bet.betAmount),
                },
              }
            );
            insertNewWalletTransaction(
              playerID,
              Math.abs(bet.betAmount),
              "Crash refund",
              { crashGameId: game._id }
            );
          }
        }

        game.refundedPlayers = refundedPlayers;
        game.status = GAME_STATES.Refunded;
        await game.save();
      } catch (error) {
        console.log(
          colors.cyan(
            `Crash >> Error while refunding crash game ${GAME_STATE._id}: ${error}`
          )
        );
      }
    }
  };

  // Refunds old unfinished games and inits new one
  const initGame = async () => {
    console.log(colors.cyan("Crash >> Starting up"));

    const unfinishedGames = await CrashGame.find({
      $or: [
        { status: GAME_STATES.Starting },
        { status: GAME_STATES.Blocking },
        { status: GAME_STATES.InProgress },
      ],
    });

    if (unfinishedGames.length > 0) {
      console.log(
        colors.cyan(`Crash >> Ending`),
        unfinishedGames.length,
        colors.cyan(`unfinished games`)
      );
      await refundGames(unfinishedGames);
    }

    runGame();
  };

  // Init the gamemode
  initGame();

  // Listen for new websocket connections
  io.of("/crash").on("connection", socket => {
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

    /**
     * @description Join a current game
     *
     * @param {number} target Auto cashout target
     * @param {number} betAmount Bet amount
     */
    socket.on("join-game", async (target, betAmount, currency) => {
      // Validate user input
      if (typeof betAmount !== "number" || isNaN(betAmount))
        return socket.emit("game-join-error", "Invalid betAmount type!");
      if (!loggedIn)
        return socket.emit("game-join-error", "You are not logged in!");

      // Get crash enabled status
      const isEnabled = getCrashState();

      // If crash is disabled
      if (!isEnabled) {
        return socket.emit(
          "game-join-error",
          "Crash is currently disabled! Contact admins for more information."
        );
      }

      // More validation on the bet value
      const { minBetAmount, maxBetAmount } = config.games.crash;
      if (
        parseFloat(betAmount.toFixed(2)) < minBetAmount ||
        parseFloat(betAmount.toFixed(2)) > maxBetAmount
      ) {
        return socket.emit(
          "game-join-error",
          `Your bet must be a minimum of ${minBetAmount} credits and a maximum of ${maxBetAmount} !`
        );
      }

      // Check if game accepts bets
      if (GAME_STATE.status !== GAME_STATES.Starting)
        return socket.emit("game-join-error", "Game is currently in progress!");
      // Check if user already betted
      if (GAME_STATE.pending[user.id] || GAME_STATE.players[user.id])
        return socket.emit(
          "game-join-error",
          "You have already joined this game!"
        );

      let autoCashOut = -1;

      // Validation on the target value, if acceptable assign to auto cashout
      if (typeof target === "number" && !isNaN(target) && target > 100) {
        autoCashOut = target;
      }

      GAME_STATE.pending[user.id] = {
        betAmount,
        autoCashOut,
        username: user.username,
        currency,
      };

      GAME_STATE.pendingCount++;

      try {
        // Get user from database
        const dbUser = await User.findOne({ _id: user.id });

        // If user is self-excluded
        if (dbUser.selfExcludes.crash > Date.now()) {
          return socket.emit(
            "game-join-error",
            `You have self-excluded yourself for another ${((dbUser.selfExcludes.crash - Date.now()) / 3600000).toFixed(1)} hours.`
          );
        }

        // If user has restricted bets
        if (dbUser.betsLocked) {
          delete GAME_STATE.pending[user.id];
          GAME_STATE.pendingCount--;
          return socket.emit(
            "game-join-error",
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // If user can afford this bet
        if (!dbUser.wallet[currency] || dbUser.wallet[currency].balance < parseFloat(betAmount.toFixed(2))) {
          console.log(colors.cyan(`Crash >> User ${user.id} cannot afford bet:`), {
            attempted_bet: parseFloat(betAmount.toFixed(2)),
            current_balance: dbUser.wallet[currency] ? dbUser.wallet[currency].balance : 0,
            currency
          });
          
          delete GAME_STATE.pending[user.id];
          GAME_STATE.pendingCount--;
          return socket.emit("game-join-error", "You can't afford this bet!");
        }

        // Remove bet amount from user's balance
        await User.updateOne(
          { _id: user.id },
          {
            $inc: {
              [`wallet.${currency}.balance`]: -Math.abs(parseFloat(betAmount.toFixed(2))),
              wager: Math.abs(parseFloat(betAmount.toFixed(2))),
              wagerNeededForWithdraw: -Math.abs(parseFloat(betAmount.toFixed(2))),
            },
          }
        );

        insertNewWalletTransaction(
          user.id,
          -Math.abs(parseFloat(betAmount.toFixed(2))),
          "Crash play",
          { 
            crashGameId: GAME_STATE._id,
            currency: currency
          }
        );

        // Update local wallet
        socket.emit("update-wallet", {
          amount: -Math.abs(parseFloat(betAmount.toFixed(2))),
          currency: currency
        });

        // Update user's race progress if there is an active race
        await checkAndEnterRace(
          user.id,
          Math.abs(parseFloat(betAmount.toFixed(2)))
        );

        // Calculate house edge
        const houseRake =
          parseFloat(betAmount.toFixed(2)) * config.games.crash.houseEdge;

        // Apply 5% rake to current race prize pool
        await checkAndApplyRakeToRace(houseRake * 0.05);

        // Apply user's rakeback if eligible
        await checkAndApplyRakeback(user.id, houseRake);

        // Apply cut of house edge to user's affiliator
        await checkAndApplyAffiliatorCut(user.id, houseRake);

        // Creating new bet object
        const newBet = {
          autoCashOut,
          betAmount,
          currency,
          createdAt: new Date(),
          playerID: user.id,
          username: user.username,
          avatar: user.avatar,
          level: getVipLevelFromWager(dbUser.wager),
          status: BET_STATES.Playing,
          forcedCashout: false,
        };

        // Updating in db
        const updateParam = { $set: {} };
        updateParam.$set["players." + user.id] = newBet;
        await CrashGame.updateOne({ _id: GAME_STATE._id }, updateParam);

        // Assign to state
        GAME_STATE.players[user.id] = newBet;
        GAME_STATE.pendingCount--;

        const formattedBet = formatPlayerBet(newBet);
        GAME_STATE.pendingBets.push(formattedBet);
        emitPlayerBets();

        return socket.emit("game-join-success", formattedBet);
      } catch (error) {
        console.error(error);

        delete GAME_STATE.pending[user.id];
        GAME_STATE.pendingCount--;

        return socket.emit(
          "game-join-error",
          "There was an error while proccessing your bet"
        );
      }
    });

    /**
     * @description Cashout the current bet
     */
    socket.on("bet-cashout", async () => {
      if (!loggedIn)
        return socket.emit("bet-cashout-error", "You are not logged in!");

      // Check if game is running
      if (GAME_STATE.status !== GAME_STATES.InProgress)
        return socket.emit(
          "bet-cashout-error",
          "There is no game in progress!"
        );

      // Calculate the current multiplier
      const elapsed = new Date() - GAME_STATE.startedAt;
      let at = growthFunc(elapsed);

      // Check if cashout is over 1x
      if (at < 101)
        return socket.emit(
          "bet-cashout-error",
          "The minimum cashout is 1.01x!"
        );

      // Find bet from state
      const bet = GAME_STATE.players[user.id];

      // Check if bet exists
      if (!bet)
        return socket.emit("bet-cashout-error", "Coudn't find your bet!");

      // Check if the current multiplier is over the auto cashout
      if (bet.autoCashOut > 100 && bet.autoCashOut <= at) {
        at = bet.autoCashOut;
      }

      // Check if current multiplier is even possible
      if (at > GAME_STATE.crashPoint)
        return socket.emit("bet-cashout-error", "The game has already ended!");

      // Check if user already cashed out
      if (bet.status !== BET_STATES.Playing)
        return socket.emit("bet-cashout-error", "You have already cashed out!");

      // Send cashout request to handler
      doCashOut(bet.playerID, at, false, (err, result) => {
        if (err) {
          console.log(
            colors.cyan(
              `Crash >> There was an error while trying to cashout a player`
            ),
            err
          );
          return socket.emit(
            "bet-cashout-error",
            "There was an error while cashing out!"
          );
        }

        socket.emit("bet-cashout-success", result);
      });
    });
  });
};

// Export functions
module.exports = {
  listen,
  getCurrentGame,
  getPrivateHash,
  formatGame,
  formatGameHistory,
};
