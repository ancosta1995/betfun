// Require Dependencies
const config = require("../config");

// Store site toggle switch states here
// and initialize them to config values
let MAINTENANCE_ENABLED = config.site.enableMaintenanceOnStart;
let LOGIN_ENABLED = config.site.enableLoginOnStart;
let DEPOSITS_ENABLED = true;
let WITHDRAWS_ENABLED = true;
let COINFLIP_ENABLED = true;
let JACKPOT_ENABLED = true;
let ROULETTE_ENABLED = true;
let CRASH_ENABLED = true;
let BATTLES_ENABLED = true;
let CUPS_ENABLED = true;
let SHUFFLE_ENABLED = false;
let CASES_ENABLED = true;
let UPGRADER_ENABLED = true;

// Create getters
const getMaintenanceState = () => MAINTENANCE_ENABLED;
const getLoginState = () => LOGIN_ENABLED;
const getDepositState = () => DEPOSITS_ENABLED;
const getWithdrawState = () => WITHDRAWS_ENABLED;
const getCoinflipState = () => COINFLIP_ENABLED;
const getJackpotState = () => JACKPOT_ENABLED;
const getRouletteState = () => ROULETTE_ENABLED;
const getCrashState = () => CRASH_ENABLED;
const getBattlesState = () => BATTLES_ENABLED;
const getCupsState = () => CUPS_ENABLED;
const getCasesState = () => CASES_ENABLED;
const getShuffleState = () => SHUFFLE_ENABLED;
const getUpgraderState = () => UPGRADER_ENABLED;

// Create reducers
const toggleMaintenance = () => {
  MAINTENANCE_ENABLED = !MAINTENANCE_ENABLED;
  return true;
};
const toggleLogin = () => {
  LOGIN_ENABLED = !LOGIN_ENABLED;
  return true;
};
const toggleDeposits = () => {
  DEPOSITS_ENABLED = !DEPOSITS_ENABLED;
  return true;
};
const toggleCups = () => {
  CUPS_ENABLED = !CUPS_ENABLED;
  return true;
};
const toggleShuffle = () => {
  SHUFFLE_ENABLED = !SHUFFLE_ENABLED;
  return true;
};

const toggleWithdraws = () => {
  WITHDRAWS_ENABLED = !WITHDRAWS_ENABLED;
  return true;
};
const toggleCoinflip = () => {
  COINFLIP_ENABLED = !COINFLIP_ENABLED;
  return true;
};
const toggleUpgrader = () => {
  UPGRADER_ENABLED = !UPGRADER_ENABLED;
  return true;
};
const toggleJackpot = () => {
  JACKPOT_ENABLED = !JACKPOT_ENABLED;
  return true;
};
const toggleRoulette = () => {
  ROULETTE_ENABLED = !ROULETTE_ENABLED;
  return true;
};
const toggleCases = () => {
  CASES_ENABLED = !CASES_ENABLED;
  return true;
};
const toggleCrash = () => {
  CRASH_ENABLED = !CRASH_ENABLED;
  return true;
};
const toggleBattles = () => {
  BATTLES_ENABLED = !BATTLES_ENABLED;
  return true;
};

// Combine transaction getters and reducers
const transactionState = {
  getDepositState,
  toggleDeposits,
  getWithdrawState,
  toggleWithdraws,
};

// Combine game getters and reducers
const gameState = {
  getCupsState,
  toggleCups,
  getShuffleState,
  toggleShuffle,
  getCoinflipState,
  toggleCoinflip,
  getJackpotState,
  toggleJackpot,
  getRouletteState,
  getCasesState,
  toggleCases,
  getUpgraderState,
  toggleUpgrader,
  toggleRoulette,
  getCrashState,
  toggleCrash,
  getBattlesState,
  toggleBattles,
};

// Export functions
module.exports = {
  getMaintenanceState,
  toggleMaintenance,
  getLoginState,
  toggleLogin,
  ...transactionState,
  ...gameState,
};
