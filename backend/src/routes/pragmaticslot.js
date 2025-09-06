// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const {validateJWT } = require("../middleware/auth");
const config = require("../config");
const axios = require('axios');
const crypto = require('crypto');

const User = require("../models/User");
const mm2Withdrawl = require("../models/mm2Withdrawl");
const item_values = require("../config/items.json");


const getSign = (key, message) => {
  return crypto.createHmac('sha256', key)
               .update(message)
               .digest('hex')
               .toUpperCase();
};

const apiUrl = 'https://api.worldslotgame.com/api/v2/game_launch';


router.post('/GetBalance', async (req, res) => {
  try {
    const { agentID, sign, userID, gameID } = req.body;

    // Construct the message for HMAC
    const message = `${agentID}${userID}${gameID}`;
    const secretKey = 'your_secret_key'; // Replace with your actual secret key

    // Generate expected sign
    const expectedSign = getSign(secretKey, message);

    // Validate the sign
    if (sign !== expectedSign) {
      return res.status(400).json({
        code: 1, // Sign mismatch error
        message: 'Invalid signature',
      });
    }

    // Find the user by userID
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({
        code: 5, // User ID not found
        message: 'Cannot find specified user ID',
      });
    }

    // Respond with the user's balance
    return res.status(200).json({
      code: 0, // Success
      message: '',
      balance: user.wallet.toFixed(2), // Ensure balance is formatted to 2 decimal places
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    return res.status(500).json({
      code: 2, // General error
      message: 'Internal server error',
    });
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
