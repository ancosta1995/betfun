const dotenv = require('dotenv');
dotenv.config();

const app = require("./controllers/express-app");
const colors = require("colors/safe");
const { Server } = require("https");
const HttpServer = require("http");
const fs = require("fs");
const { connectDatabase } = require("./utils");
const { startSocketServer } = require("./controllers/websockets");
const { initializeAgenda } = require('./controllers/bonus');

process.title = "betbasegg-api";
// Remove forced production mode
// process.env.NODE_ENV = 'production'; 
const PORT = process.env.PORT || 2053;

let server;
let agendaInstance;

// Create an async IIFE
(async () => {
  try {
    // Connect Database
    console.log(colors.yellow('Server >> Connecting to database...'));
    await connectDatabase();
    console.log(colors.green('Server >> Database connected successfully'));

    // Initialize agenda
    console.log(colors.yellow('Server >> Initializing agenda...'));
    const { agenda, startAgenda } = await initializeAgenda();
    agendaInstance = agenda;
    console.log(colors.green('Server >> Agenda initialized successfully'));

    // Read SSL certificates only in production
    if (process.env.NODE_ENV === 'production') {
      console.log(colors.yellow('Server >> Loading SSL certificates...'));
      const privateKey = fs.readFileSync('./ssl/cloudflare.key', 'utf8');
      const certificate = fs.readFileSync('./ssl/cloudflare.crt', 'utf8');
      const credentials = { key: privateKey, cert: certificate };
      console.log(colors.green('Server >> SSL certificates loaded successfully'));

      // Create HTTPS server
      server = new Server(credentials, app);
    } else {
      // Create HTTP server for development
      server = HttpServer.createServer(app);
    }

    // Start the agenda
    console.log(colors.yellow('Server >> Starting agenda jobs...'));
    await startAgenda();
    console.log(colors.green('Server >> Agenda jobs started successfully'));

    console.log(colors.green(`Server started at port ${PORT}`));

    // Setup server and start listening on given port
    server.listen(PORT, () => {
      console.log(colors.cyan('----------------------------------------'));
      console.log(colors.green(`Server >> Server Started Successfully`));
      console.log(colors.green(`Server >> Environment: ${process.env.NODE_ENV || 'development'}`));
      console.log(colors.green(`Server >> Port: ${PORT}`));
      console.log(colors.green(`Server >> WebSocket: Enabled`));
      if (process.env.NODE_ENV === 'production') {
        console.log(colors.green(`Server >> SSL: Enabled`));
      } else {
        console.log(colors.green(`Server >> SSL: Disabled`));
      }
      console.log(colors.cyan('----------------------------------------'));
    });

    // Start WebSocket server
    console.log(colors.yellow('Server >> Initializing WebSocket server...'));
    startSocketServer(server, app);
    console.log(colors.green('Server >> WebSocket server initialized'));
  } catch (error) {
    console.error(colors.red('Server startup error:'), error);
    process.exit(1);
  }
})();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(colors.red('Uncaught Exception:'), error);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error(colors.red('Unhandled Rejection:'), error);
  process.exit(1);
});

// Export server
module.exports = { server };