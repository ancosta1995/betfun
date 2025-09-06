
async function fetchPrices() {
  const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur');
  const cryptoData = await cryptoResponse.json();
  
  const fiatResponse = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
  const fiatData = await fiatResponse.json();

  console.log('Crypto Prices:', cryptoData);
  console.log('Fiat Prices:', fiatData);
}

fetchPrices();
