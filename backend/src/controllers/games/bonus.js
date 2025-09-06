// Bonus.js
const Agenda = require('agenda');
const mongoose = require('mongoose');
const Bonus = require('../../models/Bonus');
const User = require('../../models/User'); // Kullanıcı modelini içe aktar
const { getDailyExpireAt, getWeeklyExpireAt, getMonthlyExpireAt } = require('../../utils/expireDates');

// Setup Additional Variables

// Setup Additional Variables
// MongoDB Bağlantı Dizesi
const MONGO_URI = 'mongodb://localhost:27017/topia?retryWrites=true&w=majority';

// Setup Agenda instance
const agenda = new Agenda({
  db: { address: MONGO_URI, options: { useUnifiedTopology: true } },
});

// Günlük bonus hesaplama
agenda.define('calculate daily bonuses', async (job) => {
  const users = await User.find(); // Tüm kullanıcıları al

  users.forEach(async (user) => {
    const dailyBonus = user.wager * 0.06 / 100;
    const dailyExpireAt = getDailyExpireAt(); // 2 gün sonra expire olacak

    await Bonus.create({
      userId: user._id,
      dailyBonus,
      dailyExpireAt,
      isDailyClaimed: false,
    });
  });
});

// Haftalık bonus hesaplama
agenda.define('calculate weekly bonuses', async (job) => {
  const users = await User.find(); // Tüm kullanıcıları al

  users.forEach(async (user) => {
    const weeklyBonus = user.wager * 2.7 / 100;
    const weeklyExpireAt = getWeeklyExpireAt(); // Bir sonraki cumartesi expire olacak

    await Bonus.create({
      userId: user._id,
      weeklyBonus,
      weeklyExpireAt,
      isWeeklyClaimed: false,
    });
  });
});

// Aylık bonus hesaplama
agenda.define('calculate monthly bonuses', async (job) => {
  const users = await User.find(); // Tüm kullanıcıları al

  users.forEach(async (user) => {
    const monthlyBonus = user.wager * 1.2 / 100;
    const monthlyExpireAt = getMonthlyExpireAt(); // Bir sonraki ayın ilk günü expire olacak

    await Bonus.create({
      userId: user._id,
      monthlyBonus,
      monthlyExpireAt,
      isMonthlyClaimed: false,
    });
  });
});

// Zamanlamaları başlat
(async function () {
  await agenda.start();

  // Günlük bonus - Her gün UTC 12:00'da
  await agenda.every('0 12 * * *', 'calculate daily bonuses');

  // Haftalık bonus - Her cumartesi UTC 11:00'da
  await agenda.every('0 11 * * 6', 'calculate weekly bonuses'); // Cumartesi günü

  // Aylık bonus - Her ayın ilk cuma günü UTC 12:00'da
  await agenda.every('0 12 1-7 * 5', 'calculate monthly bonuses'); // Ayın ilk cuma günü
})();

agenda.on('start', job => {
    console.log(`Job ${job.attrs.name} starting`);
  });
  
  agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`);
  });
  