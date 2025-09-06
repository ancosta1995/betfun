// Require Dependencies
const { JsonRpc } = require("eosjs");
const config = require("../config");
const fetch = require("node-fetch"); // node only; not needed in browsers
const rpc = new JsonRpc(config.blochain.httpProviderApi, { fetch });
const crypto = require('crypto');

const generateServerSeedAndHash = () => {
  // Generate server seed
  const serverSeed = crypto.randomBytes(32).toString('hex');
  
  // Calculate SHA-256 hash of server seed
  const serverSeedHash = crypto.createHash('sha256').update(serverSeed).digest('hex');
  
  // Return server seed and its hash
  return { serverSeed, serverSeedHash };
};

// Grab EOS block with id
const getPublicSeed = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const info = await rpc.get_info();
      const blockNumber = info.last_irreversible_block_num + 1;
      const block = await rpc.get_block(blockNumber || 1);
      resolve(block.id);
    } catch (error) {
      reject(error);
    }
  });
};

// EOS gets the current block number
const getCurrentBlock = async () => {
  try {
    const response = await fetch("https://eos.greymass.com/v1/chain/get_info");
    const data = await response.json();
    return data.head_block_num;
  } catch (error) {
    console.error("Error getting latest block number:", error.message);
    throw error;
  }
};

// EOS waits until we can get the next block
const awaitNextBlockHash = async (waitForBlockNumber) => {
  try {
    while (true) {
      try {
        const response = await fetch("https://eos.greymass.com/v1/chain/get_block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block_num_or_id: waitForBlockNumber })
        });
        const data = await response.json();
        
        if (data.id) {
          return data.id;
        }
  
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error("Error fetching block:", error.message);
        // Retry on error
      }
    }
  } catch (error) {
    console.error("An error occurred while awaiting next block hash:", error.message);
    throw error;
  }
};

// Export functions
module.exports = { getCurrentBlock, awaitNextBlockHash, generateServerSeedAndHash, getPublicSeed };
