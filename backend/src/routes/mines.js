// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");

const MinesGame = require("../models/Mines"); // Require the MinesGame model
const User = require("../models/User");

/**
 * @route   GET /api/mines/me
 * @desc    Get active mines games
 * @access  Public
 */
router.get("/me", validateJWT, async (req, res, next) => {
  try {
    // Retrieve in-progress game for the user
    const activeGame = await MinesGame.findOne({ userId: req.user.id, status: "inprogress" });

    // Check if the game exists
    if (!activeGame) {
      console.log("No in-progress game found for the user.");
      return res.status(404).json({ message: "No in-progress game found for the user." });
    }

    // Get all tiles from the game and omit the isMine property
    const revealedTiles = activeGame.grid.map(({ revealed, _id }) => ({ revealed, _id }));

    // Send the modified response without the isMine property
    return res.json({ ...activeGame.toObject(), grid: revealedTiles });
  } catch (error) {
    return next(error);
  }
});


/**
 * @route   GET /api/mines/reveal;
 * @desc    Get reveal mines
 * @access  Public
 */
router.get("/reveal", validateJWT, async (req, res, next) => {
  try {

    // Retrieve inprogress game for the user
    const activeGame = await MinesGame.findOne({ userId: req.user.id, status: "reveal" });


    // Get all tiles from the game and omit isMine property
    const revealedTiles = activeGame.grid.map(({ revealed, _id }) => ({ revealed, _id }));


    return res.json(activeGame);
  } catch (error) {
    return next(error);
  }
});


router.post("/savecurrency", validateJWT, async (req, res, next) => {
  const { FiatCurrency, Currency, DisplayInFiat } = req.body;

  // Check if all required fields are provided
  if (!FiatCurrency || !Currency || DisplayInFiat === undefined) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
      // Get the latest user obj
      const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user with the new currency preferences
    user.FiatCurrency = FiatCurrency;
    user.Currency = Currency;
    user.DisplayInFiat = DisplayInFiat;

    // Save the changes to the database
    await user.save();

    // Respond with success message
    return res.json({ message: "Currency preferences updated successfully." });
  } catch (error) {
    // Handle any errors that occur
    return next(error);
  }
});

router.get("/currencysettings", validateJWT, async (req, res, next) => {
  try {
    // Get the latest user obj based on the JWT user ID
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Extract the currency settings from the user object
    const { FiatCurrency, Currency, DisplayInFiat } = user;

    // Respond with the user's currency preferences
    return res.json({
      FiatCurrency,
      Currency,
      DisplayInFiat,
    });
  } catch (error) {
    // Handle any errors that occur
    return next(error);
  }
});





router.get("/reveal", validateJWT, async (req, res, next) => {
  try {

    // Retrieve inprogress game for the user
    const activeGame = await MinesGame.findOne({ userId: req.user.id, status: "reveal" });


    // Get all tiles from the game and omit isMine property
    const revealedTiles = activeGame.grid.map(({ revealed, _id }) => ({ revealed, _id }));


    return res.json(activeGame);
  } catch (error) {
    return next(error);
  }
});


