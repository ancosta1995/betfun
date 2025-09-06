const express = require('express');
const router = express.Router();
const axios = require('axios');

// Free API endpoint
const API_URL = 'https://open.er-api.com/v6/latest/USD';

async function fetchExchangeRates() {
  try {
    const response = await axios.get(API_URL);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

router.get('/rates', async (req, res) => {
  try {
    const rates = await fetchExchangeRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

module.exports = router; 