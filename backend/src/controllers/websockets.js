// Require Dependencies
const socketio = require("socket.io");
const chatController = require("./chat");
const coinflipController = require("./games/coinflip");
const jackpotController = require("./games/jackpot");
const rouletteController = require("./games/roulette");
const crashController = require("./games/crash");
const battlesController = require("./games/battles");
const casesController = require("./games/cases");
// const exampleController = require("./games/example");
const cupsController = require("./games/cups");
const shuffleController = require("./games/shuffle");
const limboController = require("./games/limbo");
const diceController = require("./games/dice");
const CandleStickController = require("./games/futures");
const MinesController = require("./games/mines");
const KenoController = require("./games/keno");
const upgraderController = require("./games/upgrader");
const SlotsController = require("./games/slots");
const BetHistory = require("../models/BetHistory");

// Configure Socket.io
const startSocketServer = (server, app) => {
  try {
    // Main socket.io instance
    const io = socketio(server);

    // Make the socket connection accessible at the routes
    app.set("socketio", io);

    // Start listeners
    chatController.listen(io);
    coinflipController.listen(io);
    jackpotController.listen(io);
    rouletteController.listen(io);
    battlesController.listen(io);
    casesController.listen(io);
    crashController.listen(io);
    upgraderController.listen(io);
    cupsController.listen(io);
    shuffleController.listen(io);
    limboController.listen(io);
    diceController.listen(io);
    CandleStickController.listen(io);
    MinesController.listen(io);
    KenoController.listen(io);
    SlotsController.listen(io);

    // Listen for new websocket connections
    io.of("/chat").on("connection", socket => {
      // Handle bet history requests - no authentication required
      socket.on("request-bet-history", async ({ type }) => {
        try {
          let query = {};
          
          if (type === "High Rollers") {
            query.betAmount = { $gte: 50 };
          }

          // Add status to query to include both WIN and LOSE
          query.$or = [
            { status: "WIN" },
            { status: "LOSE" }
          ];

          console.log("Query:", query); // Debug log

          const history = await BetHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

          console.log("Found history:", history); // Debug log

          socket.emit("bet-history", history);
        } catch (error) {
          console.error("Error fetching bet history:", error);
          socket.emit("notify-error", "Failed to load betting history");
        }
      });

      // Listen for live bet updates
      socket.on("live-bet-update", (bet) => {
        // Broadcast the bet to all connected clients
        io.of("/chat").emit("live-bet-update", bet);
      });
    });

    console.log("WebSocket >>", "Connected!");
  } catch (error) {
    console.log(`WebSocket ERROR >> ${error.message}`);

    // Exit current process with failure
    process.exit(1);
  }
};

// Export functions
module.exports = { startSocketServer };
