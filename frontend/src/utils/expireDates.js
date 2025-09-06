// utils/expireDates.js
const getDailyExpireAt = () => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + 2); 
    now.setUTCHours(12, 0, 0, 0); 
    return now;
  };
  
  const getWeeklyExpireAt = () => {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysUntilNextSaturday = (6 - dayOfWeek + 7) % 7;
    now.setUTCDate(now.getUTCDate() + daysUntilNextSaturday); 
    now.setUTCHours(11, 0, 0, 0); 
  };
  
  const getMonthlyExpireAt = () => {
    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), currentMonth + 1, 1));
    nextMonth.setUTCHours(0, 0, 0, 0); 
    return nextMonth;
  };
  
  module.exports = { getDailyExpireAt, getWeeklyExpireAt, getMonthlyExpireAt };
  