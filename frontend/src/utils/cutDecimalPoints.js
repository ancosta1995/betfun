/**
 * Cuts decimal points without rounding.
 * @param {number|string} num - The number to cut.
 * @param {number} [decimals=8] - Number of decimal places to keep.
 * @returns {string} - The truncated number as a string.
 */
const cutDecimalPoints = (num, decimals = 8) => {
  if (isNaN(num) || num === null) {
    return "0"; // Handle invalid input
  }

  // Convert num to string and handle potential edge cases
  const numStr = num.toString();

  // Find the decimal point
  const decimalIndex = numStr.indexOf('.');

  if (decimalIndex === -1) {
    return numStr; // No decimal point found
  }

  // Truncate the string at the desired decimal place
  return numStr.slice(0, decimalIndex + decimals + 1); 
};

export default cutDecimalPoints;
