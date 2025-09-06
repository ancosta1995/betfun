// utils/generateRandomData.js
export const generateRandomData = (numPoints) => {
    const data = [];
    let time = Math.floor(Date.now() / 1000); // Start with the current time in seconds
    
    for (let i = 0; i < numPoints; i++) {
      // Generate random open, high, low, close values
      const open = parseFloat((Math.random() * 10).toFixed(2));
      const high = parseFloat((open + Math.random() * 2).toFixed(2));
      const low = parseFloat((open - Math.random() * 2).toFixed(2));
      const close = parseFloat((Math.random() * (high - low) + low).toFixed(2));
      
      data.push({
        time: time - i * 86400, // Previous day (86400 seconds in a day)
        open,
        high,
        low,
        close,
      });
    }
    
    return data.reverse(); // Optional: reverse to show recent data on the right
  };
  