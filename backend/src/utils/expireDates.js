// utils/expireDates.js
const getDailyExpireAt = () => {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + 2); // 2 gün sonra geçerlilik süresi
  now.setUTCHours(12, 0, 0, 0); // UTC 12:00
  return now;
};

const getWeeklyExpireAt = () => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const daysUntilNextSaturday = (6 - dayOfWeek + 7) % 7; // Bir sonraki Cumartesi
  now.setUTCDate(now.getUTCDate() + daysUntilNextSaturday); 
  now.setUTCHours(11, 0, 0, 0); // Cumartesi günü UTC 11:00
  return now; // Değeri döndür
};

const getMonthlyExpireAt = () => {
  const now = new Date();
  const currentMonth = now.getUTCMonth(); // 0: January, 1: February, ..., 11: December
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), currentMonth + 1, 1));
  nextMonth.setUTCHours(0, 0, 0, 0); // Gelecek ayın ilk günü
  return nextMonth;
};

module.exports = { getDailyExpireAt, getWeeklyExpireAt, getMonthlyExpireAt };
