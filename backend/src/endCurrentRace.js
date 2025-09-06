// Script to manually end the current race and start a new one
const mongoose = require('mongoose');
const config = require('./config');
const { endRace } = require('./controllers/jobs');
const Race = require('./models/Race');

// Connect to MongoDB
const MONGO_URI = process.env.NODE_ENV === 'production'
  ? config.database.productionMongoURI
  : config.database.developmentMongoURI;

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find active race
    const activeRace = await Race.findOne({ active: true });
    
    if (activeRace) {
      console.log(`Found active race with ID: ${activeRace._id}`);
      console.log(`Race ending date: ${activeRace.endingDate}`);
      
      // End the race
      console.log('Ending the race...');
      const result = await endRace(activeRace._id);
      
      if (result) {
        console.log('Successfully ended the race');
      } else {
        console.log('Failed to end the race');
      }
    } else {
      console.log('No active race found');
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})(); 