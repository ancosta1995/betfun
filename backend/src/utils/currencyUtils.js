// currencyUtils.js

const fs = require('fs');

// Load prices from the JSON file
const prices = JSON.parse(fs.readFileSync('Prices.json'));

/**
 * Get the conversion rate for a specific currency.
 * @param {string} currency - The currency code.
 * @returns {number|null} - The conversion rate to USD or null if not found.
 */
function getConversionRate(currency) {
  if (prices[currency] && prices[currency].USD) {
    return prices[currency].USD;
  }
  return null; // Return null if the conversion rate is not found
}

module.exports = {
  getConversionRate,
};
