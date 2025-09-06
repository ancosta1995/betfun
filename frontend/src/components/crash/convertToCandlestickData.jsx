// utils/convertToCandlestickData.js
export const convertToCandlestickData = (multiplierData) => {
    const data = [];
    let time = Math.floor(Date.now() / 1000); // Start with current time
    
    // Simulate realistic candlestick data
    for (let i = 0; i < multiplierData.length; i++) {
      const multiplier = multiplierData[i];
      const open = multiplier;
      const close = multiplier + (Math.random() * 0.1 - 0.05); // Random close value near open
      const high = Math.max(open, close) + Math.random() * 0.1; // Random high
      const low = Math.min(open, close) - Math.random() * 0.1;  // Random low
      
      data.push({
        time: time - i * 3600, // 1 hour interval
        open,
        high,
        low,
        close,
      });
    }
    
    return data.reverse(); // Optional: reverse to show recent data on the right
  };
  