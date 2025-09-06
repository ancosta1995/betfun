const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('memory-cache');

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * @route   GET api/prices
 * @desc    Get current cryptocurrency prices in various fiat currencies
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check cache first
    const cachedPrices = cache.get('prices');
    if (cachedPrices) {
      return res.json(cachedPrices);
    }

    // List of cryptocurrencies you want to track
    const cryptos = ['BTC', 'ETH', 'DOGE', 'LTC', 'USDT', 'USDC', 'TRX', 'MATIC', 'XRP', 'SOL', 'SHIB', 'TON', 'USD'];
    
    // List of fiat currencies you want to convert to
    const fiats = ['USD', 'EUR', 'IDR', 'TRY', 'MXN', 'BRL', 'JPY', 'CAD', 'CNY', 'DKK', 'KRW', 'PHP', 'NZD', 'ARS', 'RUB'];

    // Create the API URL for CoinGecko
    const cryptoIds = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      DOGE: 'dogecoin',
      LTC: 'litecoin',
      USDT: 'tether',
      USDC: 'usd-coin',
      TRX: 'tron',
      MATIC: 'matic-network',
      XRP: 'ripple',
      SOL: 'solana',
      SHIB: 'shiba-inu',
      TON: 'the-open-network',
      USD: 'usd'
    };

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: Object.values(cryptoIds).join(','),
          vs_currencies: fiats.map(f => f.toLowerCase()).join(',')
        }
      }
    );

    // Transform the response into your desired format
    const prices = {};
    cryptos.forEach(crypto => {
      prices[crypto] = {};
      const geckoId = cryptoIds[crypto];
      
      fiats.forEach(fiat => {
        if (crypto === 'USD') {
          // Handle USD as base currency
          prices[crypto][fiat] = fiat === 'USD' ? 1 : response.data['usd'][fiat.toLowerCase()];
        } else {
          prices[crypto][fiat] = response.data[geckoId][fiat.toLowerCase()];
        }
      });
    });

    // Cache the results
    cache.put('prices', prices, CACHE_DURATION);

    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ message: 'Error fetching prices' });
  }
});

module.exports = router; 