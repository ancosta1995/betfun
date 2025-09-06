const fs = require('fs');

// Define the API URL and the cryptocurrencies to query
const apiUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,USDT,USDC,TRX,MATIC,XRP,SOL,DOGE,SHIB,TON&tsyms=IDR,TRY,USD,EUR,MXN,BRL,JPY,CAD,CNY,DKK,KRW,PHP,NZD,ARS,RUB';

// Fetch data from the API
async function fetchAndSaveCryptoPrices() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Save the data to a JSON file
    fs.writeFile('Prices.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error saving data:', err);
      } else {
        console.log('Data successfully saved to Prices.json');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function immediately and then every 1 minute
fetchAndSaveCryptoPrices(); // Initial run
setInterval(fetchAndSaveCryptoPrices, 60000); // Run every 60000 milliseconds (1 minute)
