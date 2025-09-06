import io from "socket.io-client";
import { API_URL } from "./api.service";

const SOCKET_URL = API_URL.slice(0, -4);

// Export individual socket connections
export const chatSocket = io.connect(SOCKET_URL + "/chat");
export const coinflipSocket = io.connect(SOCKET_URL + "/coinflip");
export const jackpotSocket = io.connect(SOCKET_URL + "/jackpot");
export const rouletteSocket = io.connect(SOCKET_URL + "/roulette");
export const crashSocket = io.connect(SOCKET_URL + "/crash");
export const battlesSocket = io.connect(SOCKET_URL + "/battles");
export const casesSocket = io.connect(SOCKET_URL + "/cases");
export const upgraderSocket = io.connect(SOCKET_URL + "/upgrader");
export const bonusSocket = io.connect(SOCKET_URL + "/bonus");

export const cupsSocket = io.connect(SOCKET_URL + "/cups");
export const shuffleSocket = io.connect(SOCKET_URL + "/shuffle");
export const limboSocket = io.connect(SOCKET_URL + "/limbo");
export const diceSocket = io.connect(SOCKET_URL + "/dice");
export const CandleStickSocket = io.connect(SOCKET_URL + "/futures");
export const MinesSocket = io.connect(SOCKET_URL + "/mines");
export const KenoSocket = io.connect(SOCKET_URL + "/keno");
export const SlotsSocket = io.connect(SOCKET_URL + "/slots");


// Export all socket connections
export const sockets = [
  chatSocket,
  coinflipSocket,
  jackpotSocket,
  rouletteSocket,
  crashSocket,
  battlesSocket,
  upgraderSocket,
  SlotsSocket,
  casesSocket,
  cupsSocket,
  shuffleSocket,
  limboSocket,
  diceSocket,
    CandleStickSocket,
  MinesSocket,
  KenoSocket,
  bonusSocket,

];

// Authenticate websocket connections
export const authenticateSockets = token => {
  //console.log("[WS] Authenticating...");

  // Emit auth event for all sockets
  sockets.forEach(socket => socket.emit("auth", token));
};
