const logger = {
  roulette: `const Chance = require("chance");
const crypto = require("crypto")

// Game information
const GAME_ID = ""; // Game ID, also sometimes referred as Round ID
const PRIVATE_SEED = ""; // Private seed, revealed after round has ended
const PRIVATE_HASH = "" // Private hash, revealed before round has ended
const PUBLIC_SEED = ""; // Public seed, randomly generated from EOS Blockchain
const ROUND_NUMBER = 1; // What round to inspect, this is 1 for all tiles except 7x. Those will also pick round 2 (for another multiplier).

// Generate a hash from private seed
const hash = crypto.createHash("sha256").update(PRIVATE_SEED).digest("hex");

// Construct a new chance instance
const chance = new Chance(PRIVATE_SEED + "-" + GAME_ID + "-" + PUBLIC_SEED + "-" + ROUND_NUMBER);

// Generate a random, repeatable module to determine round result (index from 0-53)
const module = chance.integer({ min: 0, max: 53, fixed: 0 });

console.table({ GAME_ID, isHashValid: PRIVATE_HASH === hash, module });
  `,
  jackpot: `const Chance = require("chance");
 const crypto = require("crypto")
 
 // Game information
 const GAME_ID = ""; // Game ID, also sometimes referred as Round ID
 const PRIVATE_SEED = ""; // Private seed, revealed after game has ended
 const PRIVATE_HASH = "" // Private hash, revealed before game has ended
 const PUBLIC_SEED = ""; // Public seed, randomly generated from EOS Blockchain
 const MAX_TICKET = 0; // The biggest ticket in the game
 
 // Generate a hash from private seed
 const hash = crypto.createHash("sha256").update(PRIVATE_SEED).digest("hex");
 
 // Construct a new chance instance
 const chance = new Chance(GAME_ID + "-" + PRIVATE_SEED + "-" + PUBLIC_SEED);
 
 // Generate a random, repeatable module to determine round result (multiplier from 0-100)
 const module = chance.floating({ min: 0, max: 100, fixed: 7 });
 
 // Calculate winning ticket
 const winningTicket = Math.round(MAX_TICKET * (module / 100));
 
 console.table({ GAME_ID, isHashValid: PRIVATE_HASH === hash, module, winningTicket });
   `,
  coinflip: `const Chance = require("chance");
const crypto = require("crypto")

// Game information
const GAME_ID = ""; // Game ID, also sometimes referred as Round ID
const PRIVATE_SEED = ""; // Private seed, revealed after game has ended
const PRIVATE_HASH = "" // Private hash, revealed before game has ended
const PUBLIC_SEED = ""; // Public seed, randomly generated from EOS Blockchain

// Generate a hash from private seed
const hash = crypto.createHash("sha256").update(PRIVATE_SEED).digest("hex");

// Construct a new chance instance
const chance = new Chance(PRIVATE_SEED + "-" + GAME_ID + "-" + PUBLIC_SEED);

/**
 * Generate a random, repeatable module to determine round result (index from 0-60)
 * 
 * Players: 2
 * T side - Modules 0-30
 * CT side - Modules 30-60
 * --
 */
const module = chance.floating({ min: 0, max: 60, fixed: 7 });

console.table({ GAME_ID, isHashValid: PRIVATE_HASH === hash, module });
  `,
  crash: `const crypto = require("crypto")

// Game information
const GAME_ID = ""; // Game ID, also sometimes referred as Round ID
const PRIVATE_SEED = ""; // Private seed, revealed after game has ended
const PRIVATE_HASH = "" // Private hash, revealed when new game starts
const PUBLIC_SEED = ""; // Public seed, randomly generated from EOS Blockchain when game starts counting

// Generate a hash from private seed and public seed
const privateHash = crypto.createHash("sha256").update(PRIVATE_SEED).digest("hex");

// Function to generate a crashpoint from seed + salt
const generateCrashPoint = (seed, salt) => {
  const hash = crypto.createHmac("sha256", seed).update(salt).digest("hex");

  const hs = parseInt(100 / (0.07 * 100));
  if (divisible(hash, hs)) {
    return 100;
  }

  const h = parseInt(hash.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h));
};

const divisible = (hash, mod) => {
  let val = 0;

  let o = hash.length % 4;
  for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
};

// Generate a random crash point from the needed inputs
const crashPoint = generateCrashPoint(PRIVATE_SEED, PUBLIC_SEED);

console.table({ GAME_ID, isHashValid: PRIVATE_HASH === privateHash, crashPoint: crashPoint / 100 });
  `,
  casebattles: `const seedrandom = require("seedrandom");

const serverSeed = "";
const blockHash = "";
const rounds = 0;
const players = 0;

const mod = \`\${serverSeed}\${blockHash}\`;

let table = [["Player/Round"]];

for (let round = 1; round <= rounds; round++) {
  table[0].push(\`Round \${round}\`);
}

for (let slot = 1; slot <= players; slot++) {
  const rowData = [\`Player \${slot}\`];
  for (let round = 1; round <= rounds; round++) {
    const seed = \`\${mod}:\${round}:$\{slot}\`;
    const rollNumber = seedrandom(seed)();
    const ticket = ~~(rollNumber * 100_000);

    rowData.push(ticket);
  }
  table.push(rowData);
}

const [, ...data] = table;

const transformed = data.reduce((acc, row, index) => {
  const playerId = \`Player \${index + 1}\`;
  acc[playerId] = {};
  for (let i = 1; i < row.length; i++) {
    acc[playerId][\`Round \${i}\`] = row[i];
  }
  return acc;
}, {});

console.table(transformed);`,
  upgrader: `const crypto = require("crypto");

const serverSeed = "";
const clientSeed = "";
const nonce = 0;

const getRandomRollValue = (serverSeed, clientSeed, nonce) => {
  const min = 1;
  const max = 1000000001;

  const rollValue = getRandomIntValue(serverSeed, clientSeed, nonce, max - min);

  return rollValue + min;
};

const getCombinedSeed = (serverSeed, clientSeed, nonce) => {
  return [serverSeed, clientSeed, nonce].join(":");
}

const getRandomIntValue = (serverSeed, clientSeed, nonce, maxNumber) => {
  const seed = getCombinedSeed(serverSeed, clientSeed, nonce);
  return getRandomInt({ max: maxNumber, seed });
};

function getRandomInt({ max, seed }) {
  const hash = crypto.createHmac("sha256", seed).digest("hex");

  const subHash = hash.slice(0, 13);
  const valueFromHash = Number.parseInt(subHash, 16);

  const e = Math.pow(2, 52);
  const result = valueFromHash / e;
  return Math.floor(result * max);
}

console.log(getRandomRollValue(serverSeed, clientSeed, nonce));
  `,
  cases: `const crypto = require("crypto");

const serverSeed = "";
const clientSeed = "";
const nonce = 0;

const getRandomRollValue = (serverSeed, clientSeed, nonce) => {
  const min = 0;
  const max = 100000;

  const rollValue = getRandomIntValue(serverSeed, clientSeed, nonce, max - min);

  return rollValue + min;
};

const getCombinedSeed = (serverSeed, clientSeed, nonce) => {
  return [serverSeed, clientSeed, nonce].join(":");
};

const getRandomIntValue = (serverSeed, clientSeed, nonce, maxNumber) => {
  const seed = getCombinedSeed(serverSeed, clientSeed, nonce);
  return getRandomInt({ max: maxNumber, seed });
};

function getRandomInt({ max, seed }) {
  const hash = crypto.createHmac("sha256", seed).digest("hex");

  const subHash = hash.slice(0, 13);
  const valueFromHash = Number.parseInt(subHash, 16);

  const e = Math.pow(2, 52);
  const result = valueFromHash / e;
  return Math.floor(result * max);
};

const result = getRandomRollValue(serverSeed, clientSeed, nonce);

console.log(result);`
};

export default logger;