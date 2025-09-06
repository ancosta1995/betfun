// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const {validateJWT } = require("../middleware/auth");
const config = require("../config");
const axios = require('axios');

const User = require("../models/User");
const mm2Withdrawl = require("../models/mm2Withdrawl");
const item_values = require("../config/items.json");



const apiUrl = 'https://api.worldslotgame.com/api/v2/game_launch';
router.post('/launch-game', async (req, res) => {
  try {
    const { provider_code, game_code, game_type, user_code, user_balance } = req.body; // Destructure parameters from the request body

    // Construct the request body object
    const requestBody = {
      agent_code: 'uragentcode//actuallyusername',
      agent_token: 'uragenttoken',
      user_code: user_code,
      game_type: game_type,
      provider_code: provider_code,
      game_code: game_code,
      lang: 'en',
      user_balance: user_balance
    };

    const apiUrl = 'https://api.worldslotgame.com/api/v2/game_launch';

    const response = await axios.post(apiUrl, requestBody);
    console.log('Game launched successfully:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error launching game:', error);
    res.status(500).json({ success: false, error: 'Error launching game' });
  }
});

router.post('/slot/gold_api/game_callback', async (req, res) => {
  try {
    const { agent_code, agent_secret, agent_balance, user_code, user_total_credit, user_total_debit, game_type, casino, slot } = req.body;

    // Determine which game type is being played (casino or slot)
    const game = game_type === 'casino' ? casino : slot;

    // Destructure properties from the game object
    const { provider_code, game_code, round_id, type, bet, win, txn_id, txn_type, is_buy, is_call, user_before_balance, user_after_balance, agent_before_balance, agent_after_balance, created_at } = game;

    // Find the user by user_code
    const user = await User.findOne({ _id: user_code });

    if (!user) {
      return res.json({
          status: 0,
          msg: "INVALID_USER",
      });
    }

    // Check if user has sufficient funds
    if (user.wallet <= 0) {
        return res.json({
            status: 0,
            user_balance: 0,
            msg: "INSUFFICIENT_USER_FUNDS",
        });
    }
    if (user.wallet <= bet) {
        return res.json({
            status: 0,
            user_balance: 0,
            msg: "INSUFFICIENT_USER_FUNDS",
        });
    }

    // Calculate updated user balance
    const updatedUserBalance = user.wallet + (win - bet);
    console.log('Updated User Balance:', updatedUserBalance);

    // Update user balance in the database
    await User.findOneAndUpdate({ _id: user_code }, { $set: { wallet: updatedUserBalance } });

    // Update statistics
    // Return success response with updated user balance based on the game type
    if (game_type === 'casino') {
      return res.status(200).json({ status: 1, user_balance: updatedUserBalance });
    } else {
      return res.status(200).json({ success: true, message: 'Slot callback processed successfully', updatedUserBalance });
    }
  } catch (error) {
    console.error('Error processing game callback:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
