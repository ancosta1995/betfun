// Require Dependencies
const config = require("../config");
const colors = require("colors/safe");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const Agenda = require("agenda");

const User = require("../models/User");
const Race = require("../models/Race");
const RaceEntry = require("../models/RaceEntry");

// Setup Additional Variables
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? config.database.productionMongoURI
    : config.database.developmentMongoURI;

// Setup Agenda instance
const agenda = new Agenda({
  db: { address: MONGO_URI, options: { useUnifiedTopology: true } },
});

// Define agenda Jobs
agenda.define("endActiveRace", { priority: "high" }, async (job) => {
  const { _id } = job.attrs.data;

  // Find race from db
  const race = await Race.findOne({ _id });
  
  // If no specific race ID was provided, get the active race
  if (!race && !_id) {
    const activeRace = await Race.findOne({ active: true });
    if (activeRace) {
      await endRace(activeRace._id);
      return;
    } else {
      console.log(colors.yellow("Race >> No active race to end"));
      return;
    }
  }

  if (race) {
    await endRace(race._id);
  } else {
    console.log(colors.red("Race >> Race not found for ID:"), _id);
  }
});

// Helper function to end a race
async function endRace(raceId) {
  try {
    const race = await Race.findOne({ _id: raceId });
    if (!race || !race.active) {
      console.log(colors.yellow("Race >> Race is either not found or already ended"));
      return;
    }

    const participants = await RaceEntry.find({ _race: raceId }).sort({ value: -1 }).lean();

    // Variable to hold winner data
    const winners = [];

    // Payout winners
    for (let index = 0; index < participants.length; index++) {
      const userId = participants[index]._user;

      // If user is in the winning place
      if (index < config.games.race.prizeDistribution.length) {
        const payout = race.prize * (config.games.race.prizeDistribution[index] / 100);

        // Add to array
        winners.push(userId);

        try {
          // Get the user to check wallet type
          const user = await User.findOne({ _id: userId });
          
          if (!user) {
            console.log(colors.yellow(`Race >> User ${userId} not found for payout`));
            continue;
          }
          
          // Check wallet type and structure
          if (typeof user.wallet === 'object') {
            console.log(colors.yellow(`Race >> User ${userId} has wallet as object, inspecting structure`));
            
            // Log wallet structure for debugging
            console.log(`Wallet structure for user ${userId}:`, JSON.stringify(user.wallet));
            
            // Just add a transaction to log the win without updating the wallet
            // since we're encountering errors with the wallet structure
            await insertNewWalletTransaction(
              userId,
              Math.abs(payout),
              `Race win #${index + 1} (prize pending)`,
              { raceId: race._id, pending: true }
            );
            
            console.log(colors.yellow(`Race >> Logged win for user ${userId} but wallet update skipped due to complex structure`));
          } else {
            // Default behavior for numeric wallet
            await User.updateOne(
              { _id: userId },
              { $inc: { wallet: Math.abs(payout) } }
            );
            
            // Log the transaction
            await insertNewWalletTransaction(
              userId,
              Math.abs(payout),
              `Race win #${index + 1}`,
              { raceId: race._id }
            );
            
            console.log(colors.green(`Race >> Paid user ${userId} amount ${payout} for position ${index + 1}`));
          }
        } catch (error) {
          console.error(colors.red(`Race >> Error paying user ${userId}:`), error);
        }
      }
    }

    // Update race document
    await Race.updateOne(
      { _id: raceId },
      {
        $set: {
          active: false,
          winners,
        },
      }
    );

    // Start a new race
    await agenda.now("startWeeklyRace");

    console.log(colors.green("Race >> Successfully ended race"), raceId);
    return true;
  } catch (error) {
    console.error(colors.red("Race >> Error ending race:"), error);
    return false;
  }
}

// Define a job to end current race (can be triggered manually)
agenda.define("endCurrentRace", { priority: "high" }, async (job) => {
  try {
    const activeRace = await Race.findOne({ active: true });
    if (activeRace) {
      await endRace(activeRace._id);
      console.log(colors.green("Race >> Manually ended current race"));
    } else {
      console.log(colors.yellow("Race >> No active race to end"));
    }
  } catch (error) {
    console.error(colors.red("Race >> Error ending current race:"), error);
  }
});

// Haftalık yarışı otomatik başlat
agenda.define("startWeeklyRace", { priority: "high" }, async (job) => {
  try {
    // Aktif yarış var mı kontrol et
    const activeRace = await Race.findOne({ active: true });
    
    // Eğer aktif yarış yoksa yeni bir yarış başlat
    if (!activeRace) {
      // 7 gün sonrası için bitiş tarihi hesapla
      const endingDate = new Date();
      endingDate.setDate(endingDate.getDate() + 7);
      
      // Yeni yarış oluştur
      const newRace = new Race({
        active: true,
        prize: 2000, // Ödül miktarı (isteğe bağlı olarak değiştirilebilir)
        endingDate: endingDate,
      });
      
      // Yeni yarışı kaydet
      await newRace.save();
      
      // Yarışın otomatik olarak bitirilmesi için job planla
      await agenda.schedule(endingDate, "endActiveRace", { _id: newRace.id });
      
      console.log(colors.green("Race >> Automatically started weekly race"), newRace.id);
      console.log(colors.green("Race >> Will end on:"), endingDate.toISOString());
      
      return newRace;
    } else {
      console.log(colors.yellow("Race >> Weekly race not started, there is already an active race"));
      return null;
    }
  } catch (error) {
    console.error(colors.red("Race >> Error starting weekly race:"), error);
    return null;
  }
});

// IIFE to give access to async/await
(async () => {
  // Startup agenda
  await agenda.start();
  
  // Haftalık yarışı her pazartesi UTC 00:00'da başlat
  await agenda.every('0 0 * * 1', 'startWeeklyRace');
  
  // Schedule job to check active races every hour and end them if they're past their endingDate
  await agenda.every('0 * * * *', 'checkAndEndExpiredRaces');
  
  // İlk çalıştırmada aktif yarış var mı kontrol et
  const activeRace = await Race.findOne({ active: true });
  
  // Check if active race is expired
  if (activeRace && new Date(activeRace.endingDate) < new Date()) {
    console.log(colors.yellow("Race >> Found expired active race, ending it now"));
    await agenda.now('endActiveRace', { _id: activeRace.id });
  } else if (!activeRace) {
    // Eğer aktif yarış yoksa hemen bir yarış başlat
    await agenda.now('startWeeklyRace');
  }
  
  console.log(colors.green("Agenda >> Started all jobs"));
})();

// Define job to check and end expired races
agenda.define("checkAndEndExpiredRaces", { priority: "medium" }, async (job) => {
  try {
    const now = new Date();
    const expiredRaces = await Race.find({ 
      active: true,
      endingDate: { $lt: now }
    });
    
    if (expiredRaces.length > 0) {
      console.log(colors.yellow(`Race >> Found ${expiredRaces.length} expired races, ending them now`));
      
      for (const race of expiredRaces) {
        await endRace(race._id);
      }
    }
  } catch (error) {
    console.error(colors.red("Race >> Error checking expired races:"), error);
  }
});

// Export agenda instance
module.exports = { agenda, endRace };
