// Require Dependencies
const axios = require("axios");
const config = require("../config");

async function makeReq(coin, network) {
  let add;
  const header = {
    "Content-Type": "application/json"
  };
  
  try {
    const response = await axios.post(`https://api.oxapay.com/merchants/request/staticaddress`, 
      {
        "merchant": config.authentication.oaxpay.merchant_id,
        "currency": coin,
        "callbackUrl": config.authentication.oaxpay.callback_url,
        "network": network // Include the network parameter here
      }, { headers: header });
    
    add = response.data.address; // Assuming the API response includes an 'address' field
  } catch (error) {
    console.error('Error while creating static address:', error);
    throw new Error("Error creating static address");
  }

  return add;
}


async function createDepositAddress() {
  // Define networks mapping for all supported currencies
  const networks = {
    btc: "Bitcoin",
    ltc: "Litecoin",
    eth: "ERC20",  // Ethereum network
    doge: "Dogecoin",
    usdt: ["ERC20", "TRC20", "BEP20"], // USDT can be on different networks
    usdc: ["ERC20", "BEP20"], // USDC on ERC20 and BEP20
    bnb: "BEP20", // BNB Smart Chain
    bch: "BitcoinCash", // Bitcoin Cash
    xmr: "Monero", // Monero
    shib: "BEP20", // Shiba Inu on BNB Smart Chain
    // sol: "Solana", // Solana
    ton: "Ton", // The Open Network (TON)
  };

  const addrs = {};

  for (const coin in networks) {
    const networkList = Array.isArray(networks[coin]) ? networks[coin] : [networks[coin]];
    // Store addresses for each network
    addrs[coin] = {};
    
    for (const network of networkList) {
      try {
        addrs[coin][network] = await makeReq(coin.toUpperCase(), network); // Requesting address for each network
      } catch (error) {
        console.error(`Error creating address for ${coin} on ${network}:`, error);
      }
    }
  }

  return addrs;
}



async function createWithdrawTransaction() {
  try {

  } catch (error) {
    console.log(error);
  }
}

async function getCryptoRate(currency) {
  try {
    const response = await axios.get(`https://api.oxapay.com/merchants/rates`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    // Response contains rates for all currencies
    const rates = response.data;
    return rates[currency.toUpperCase()];
  } catch (error) {
    console.error('Error fetching crypto rate:', error);
    throw new Error("Error getting crypto rate");
  }
}

module.exports = {
  createDepositAddress,
  createWithdrawTransaction,
  getCryptoRate
};
