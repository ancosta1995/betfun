// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");
const axios = require("axios");
const fs = require('fs').promises;
const path = require('path');

const User = require("../models/User");

/**
 * @route   POST /api/roblox/deposit
 * @desc    Create a deposit request
 * @access  Public`
 */
// Function to generate a random 8-letter string
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
// Function to check deposit queue status
async function checkDepositQueue(botName, stopIntervalCallback) {
  try {
      // Make a request to depositqueue
      const depositResponse = await fetch(`http://localhost:2053/api/roblox/depositqueue?botName=${botName}`, { method: 'GET' });
      if (!depositResponse.ok) {
          throw new Error(`HTTP error! status: ${depositResponse.status}`);
      }
      const depositMessage = await depositResponse.text();
      console.log('Deposit queue status:', depositMessage);

      if (depositMessage === "Bot not found") {
          // If bot not found, stop the interval
          clearInterval(stopIntervalCallback);
      }

      // Return deposit message
      return depositMessage;
  } catch (error) {
      console.error('Error checking deposit queue:', error);
      throw new Error('Failed to check deposit queue');
  }
}

// Timer to periodically check deposit queue
function startDepositQueueCheck(botName) {
  let elapsedTime = 0;
  const interval = 750; // Check every 1 second
  const maxElapsedTime = 120 * 1000; // 60 seconds
   
  const stopIntervalCallback = setInterval(async () => {
      try {
          const depositMessage = await checkDepositQueue(botName, stopIntervalCallback);
          if (depositMessage === "Bot not found") {
              clearInterval(stopIntervalCallback);
          }

          // Increment elapsed time by the interval
          elapsedTime += interval;
          console.log("Elapsed Time", elapsedTime / 1000)
          // Check if elapsed time exceeds the maximum allowed time
          if (elapsedTime >= maxElapsedTime) {
              // Trigger removal process
              await fetch(`http://localhost:8080/remove?botname=${botName}`, { method: 'POST' });
              clearInterval(stopIntervalCallback);
          }
      } catch (error) {
          console.error('Error in deposit queue check timer:', error);
          clearInterval(stopIntervalCallback);
      }
  }, interval);
}

router.get('/depositqueue', async (req, res) => {
  const { botName } = req.query;
  try {
      const responsedepositqueue = await fetch(`http://localhost:8080/depositqueue?botName=${botName}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      if (!responsedepositqueue.ok) {
          throw new Error(`HTTP error! status: ${responsedepositqueue.status}`);
      }
      const responseData = await responsedepositqueue.text();
      console.log('Deposit queue status:', responseData);
      res.send(responseData); // Send responseData back to the client if needed
  } catch (error) {
      console.error('Error fetching deposit queue status:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});


router.post('/:user_id/world/:world', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const world = req.params.world;

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).send('Kullanıcı bulunamadı');
    }

    await User.findOneAndUpdate({ _id: user_id }, { $set: { world: world } });

    res.send(`Kullanıcının Worldu güncellendi: ${user.user_id}, Yeni World: ${world}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});


router.get('/:user_id/balance/:wallet', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const wallet = parseFloat(req.params.wallet);

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).send('Kullanıcı bulunamadı');
    }


     await User.findOneAndUpdate({ _id: user_id }, { $set: { wallet: wallet + user.wallet} });

    res.send(`Kullanıcının bakiyesi güncellendi: ${user.user_id}, Yeni Bakiye: ${user.wallet}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});
async function loadBotsFromJSON(filePath) {
  try {
      const data = await fs.readFile(filePath, 'utf-8');
      const bots = JSON.parse(data);
      return bots;
  } catch (error) {
      console.error('Error loading bots from JSON file:', error);
      throw new Error('Failed to load bots from JSON file');
  }
}
router.post("/deposit", async (req, res, next) => {
  try {
    const { user_id, GrowID } = req.body;

      const jsonFilePath = 'C:/Users/byte/Desktop/lucitest/bots.json'; // Path to your JSON file
      const bots = await loadBotsFromJSON(jsonFilePath);

      let botName, botPass; // Declare variables here

      // Fetch bot status data to check if bot already exists
      const responseStatus = await fetch('http://localhost:8080/bot/status');
      if (!responseStatus.ok) {
          throw new Error(`HTTP error! status: ${responseStatus.status}`);
      }
      const statusData = await responseStatus.json();

      // Loop through the available bots until a non-existing one is found
      let botFound = false;
      for (const bot of bots) {
          // Check if botName already exists in statusData (case-insensitive comparison)
          const botExists = statusData.some(existingBot => existingBot.name.toLowerCase() === bot.botName.toLowerCase());
          if (!botExists) {
              botName = bot.botName;
              botPass = bot.botPass;
              botFound = true;
              break;
          }
      }

      // If all bots already exist, return an error
      if (!botFound) {
        const responseWorld = await fetch(`http://localhost:2053/api/roblox/${user_id}/world/Bot Not Available try again in few minutes.`, { method: 'POST' });  
          return res.status(400).json({ error: 'All bots already exist' });
      }

      // Add the bot
      const responseAddBot = await fetch(`http://localhost:8080/addBot/?bot=${encodeURIComponent(botName)}|${encodeURIComponent(botPass)}`, { method: 'POST' });
      if (!responseAddBot.ok) {
          throw new Error(`HTTP error! status: ${responseAddBot.status}`);
      }

      // Generate a random world name
      const worldName = generateRandomString();

      // Make a request to generate the world
      const responseGenerateWorld = await fetch(`http://localhost:8080/generateworld?botName=${botName}&worldname=${worldName}`, { method: 'POST' });
      if (!responseGenerateWorld.ok) {
          throw new Error(`HTTP error! status: ${responseGenerateWorld.status}`);
      }

      // Start timer to check the deposit queue periodically
      startDepositQueueCheck(botName);
      const responseWorld = await fetch(`http://localhost:2053/api/roblox/${user_id}/world/${worldName}`, { method: 'POST' });
      if (!responseWorld.ok) {
          throw new Error(`HTTP error! status: ${responseWorld.status}`);
      }

      // Return success message
      res.json({ message: 'Bot added successfully and world generated', worldName });
  } catch (error) {
      console.error('Error adding bot:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
// Define a route to fetch and serve bot status data
router.get('/bot/status', async (req, res, next) => {
  try {
      const response = await fetch('http://localhost:8080/bot/status');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error('Error fetching bot status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/roblox/check
 * @desc    Check's if a thing is verified to their name
 * @access  Public`
 */
router.post("/check", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;

    let user = await User.findOne({ robloxUsername: username });
    if(user) return res.status(200).json({ taken: true });
    user = await User.findOne({ _id: user_id });

    fetch(`https://www.roblox.com/users/profile?username=${username}`)
      .then(response => response.text())
      .then(async (data) => {
        if (data.includes(user.mnemonicPhrase)) {
          await User.findOneAndUpdate({ _id: user_id }, { $set: { robloxUsername: username }});
          return res.status(200).json({ success: true });
        } else {
          return res.status(200).json({ mnemonicPhrase: true });
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/roblox/check
 * @desc    Check's if a thing is verified to their name
 * @access  Public`
 */
router.post("/unlink", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;

    await User.findOneAndUpdate({ _id: user_id }, { $set: { robloxUsername: "" }});
    return res.status(200).json({ success: true });

  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/roblox/stock
 * @desc    Get's avaible items on bot trader accounts
 * @access  Public`
 */
router.get("/stock", async (req, res, next) => {
  try {
    // Simulated data for MM2 stock
    const fakeMM2Stock = [
      { _id: "1", display_name: "Diamond Lock", priceUSD: 0.30, thumbnail: "https://cdn.discordapp.com/attachments/1008423958787403849/1231909524135477288/kindpng_4497640.png?ex=6638ac26&is=66263726&hm=4bb88602357cdf9377c338f8f03f69020b46e82d3e5e942f22a0086820c358da&" },
      { _id: "2", display_name: "Diamond Lock", priceUSD: 0.30, thumbnail: "https://cdn.discordapp.com/attachments/1008423958787403849/1231909524135477288/kindpng_4497640.png?ex=6638ac26&is=66263726&hm=4bb88602357cdf9377c338f8f03f69020b46e82d3e5e942f22a0086820c358da&" },
      { _id: "3", display_name: "Da Vinci Wings", priceUSD: 2000, thumbnail: "https://growdice.co/items/53.png" },
      { _id: "4", display_name: "Rayman Fist", priceUSD: 2000, thumbnail: "https://growdice.co/items/43.png" },

      // Add more items as needed
    ];

    // Simulated data for Adopt Me stock
    const fakeAdoptMeStock = [
      { _id: "3", display_name: "Pet 1", priceUSD: 0.30, thumbnail: "https://growdice.co/assets/dl-2a39d38a.webp" },
      { _id: "4", display_name: "Pet 2", priceUSD: 0.30, thumbnail: "https://growdice.co/assets/dl-2a39d38a.webp" },
      // Add more pets as needed
    ];

    // Return the fake data
    return res.status(200).json({ 
      mm2: fakeMM2Stock,
      amp: fakeAdoptMeStock,
    });

  } catch (error) {
    return next(error);
  }
});



/**
 * @route   POST /api/roblox/withdraw
 * @desc    Create a withdraw request
 * @access  Public`
 */
router.post("/withdraw", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;
    const { token } = req.body;
    const { items } = req.body;
    const { gameCode } = req.body;

    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token
    };

    const data = {
      username: username,
      session_type: gameCode,
      items: items
    };

    console.log(req)
    const ress = await axios.post("https://hook.rbxcat.com/withdraw/create_session", data, { headers: headers });
    console.log(ress)

    let error = false, reason = null;
    if (ress.status != 200) {
      error = true;
      reason = ress.data.status;
    }

    let link, botUsername;
    if (gameCode == "mm2") {
      link = "https://www.roblox.com/games/142823291?privateServerLinkCode=67604789860287160138119263971729";
      botUsername = "chanceholder1";
    } else if (gameCode == "adoptme") {
      link = "https://www.roblox.com/games/920587237?privateServerLinkCode=52794204607978306416180650763588";
      botUsername = "chanceamp1";
    }
    
    return res.status(200).json({ 
      link: link,
      botName: botUsername,
      error: error,
      reason: reason
    });

  } catch (error) {
    return next(error);
  }
});