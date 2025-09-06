// bonus.js
const Agenda = require('agenda');
const mongoose = require('mongoose');
const Bonus = require('../models/Bonus');
const User = require('../models/User');
const config = require('../config');

// Setup MongoDB URI
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? config.database.productionMongoURI
    : config.database.developmentMongoURI;

// Setup Agenda instance with a delay to ensure MongoDB connection
let agenda;

const initializeAgenda = async () => {
  // Wait a bit for the MongoDB connection to be established
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  agenda = new Agenda({
    mongo: mongoose.connection.db,
    db: { collection: 'agendaJobs' },
  });

  // Model for storing the next weekly time
  const WeeklyTime = mongoose.model('WeeklyTime', new mongoose.Schema({
    nextWeeklyTime: Date,
  }));

  // Helper function to calculate the next Saturday at 12:30 PM GMT
  const calculateNextWeeklyTime = async () => {
    const now = new Date(); // Current time in local timezone
    const utcNow = new Date(now.toUTCString()); // Get UTC time
    
    const dayOfWeek = utcNow.getUTCDay(); // 0 - Sunday, 1 - Monday, ..., 6 - Saturday
    let daysUntilSaturday = (6 - dayOfWeek + 7) % 7; // 0 if today is Saturday
    
    // If today is Saturday and current time is past 12:30 PM GMT, move to next Saturday
    if (daysUntilSaturday === 0 && (utcNow.getUTCHours() > 12 || (utcNow.getUTCHours() === 12 && utcNow.getUTCMinutes() >= 30))) {
      daysUntilSaturday = 7; // Move to next Saturday
    }
    
    // Create a new date object for next Saturday at 12:30 PM GMT
    const nextWeeklyTime = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate() + daysUntilSaturday, 12, 30, 0));

    // Save to database
    await WeeklyTime.findOneAndUpdate({}, { nextWeeklyTime }, { upsert: true });
    return nextWeeklyTime;
  };

  // Define job for calculating daily bonuses
  agenda.define('calculate daily bonuses', async (job) => {
    console.log("Calculating daily bonuses...");

    const users = await User.find();
    console.log(`Found ${users.length} users for daily bonuses.`);

    for (const user of users) {
      const dailyBonus = user.wager * 0.06 / 100;

      await Bonus.create({
        userId: user._id,
        dailyBonus,
        isDailyClaimed: false,
      });

      console.log(`Created daily bonus for user ${user._id}: ${dailyBonus}`);
    }

    console.log("Daily bonuses calculation completed.");
  });

  // Define job for calculating weekly bonuses
  agenda.define('calculate weekly bonuses', async (job) => {
    console.log("Calculating weekly bonuses...");

    const users = await User.find();
    console.log(`Found ${users.length} users for weekly bonuses.`);

    for (const user of users) {
      const weeklyBonus = user.wager * 2.7 / 100;

      await Bonus.create({
        userId: user._id,
        weeklyBonus,
        isWeeklyClaimed: false,
      });

      console.log(`Created weekly bonus for user ${user._id}: ${weeklyBonus}`);
    }

    console.log("Weekly bonuses calculation completed.");
  });

  // Define job for calculating monthly bonuses
  agenda.define('calculate monthly bonuses', async (job) => {
    console.log("Calculating monthly bonuses...");

    const users = await User.find();
    console.log(`Found ${users.length} users for monthly bonuses.`);

    for (const user of users) {
      const monthlyBonus = user.wager * 1.2 / 100;

      await Bonus.create({
        userId: user._id,
        monthlyBonus,
        isMonthlyClaimed: false,
      });

      console.log(`Created monthly bonus for user ${user._id}: ${monthlyBonus}`);
    }

    console.log("Monthly bonuses calculation completed.");
  });

  // Function to start agenda after MongoDB connection is established
  const startAgenda = async () => {
    await agenda.start();
    console.log("Agenda started successfully");

    // Calculate and store the next weekly time on startup
    await calculateNextWeeklyTime();

    // Schedule jobs
    await agenda.every('0 12 * * *', 'calculate daily bonuses'); // Daily bonuses at UTC 12:00
    const weeklyTimeEntry = await WeeklyTime.findOne();
    if (weeklyTimeEntry) {
      const nextWeeklyJobTime = weeklyTimeEntry.nextWeeklyTime;
      await agenda.schedule(nextWeeklyJobTime, 'calculate weekly bonuses'); // Weekly bonuses based on the next weekly time
    }
    await agenda.every('0 12 1 * *', 'calculate monthly bonuses'); // Monthly bonuses on the first day of each month at UTC 12:00

    // Set interval to update next weekly time
    setInterval(async () => {
      const nextWeeklyTime = await calculateNextWeeklyTime();
      console.log(`Next weekly time set to: ${nextWeeklyTime}`);
    }, 1000 * 60 * 60 * 24); // Update daily
  };

  // Event listeners for job start and completion
  agenda.on('start', job => {
    console.log(`Job ${job.attrs.name} starting`);
  });

  agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`);
  });

  return { agenda, startAgenda };
};

// Export the agenda instance and start function
module.exports = { initializeAgenda };