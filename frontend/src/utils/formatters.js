export const formatNumber = (number, options = {}) => {
  const {
    decimals = 2,
    minDecimals,
    maxDecimals = 8,
    compact = false
  } = options;

  if (typeof number !== 'number' || isNaN(number)) return '0';

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minDecimals ?? decimals,
    maximumFractionDigits: maxDecimals,
    notation: compact ? 'compact' : 'standard'
  });

  return formatter.format(number);
}; 