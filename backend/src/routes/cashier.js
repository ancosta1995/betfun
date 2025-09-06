// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const {
  createDepositAddress,
  createWithdrawTransaction,
  getCryptoRate
} = require("../controllers/0xapay");
const QRCode = require("qrcode");
const colors = require("colors");
const config = require("../config");
const { validateJWT } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const {
  getDepositState,
  getWithdrawState,
} = require("../controllers/site-settings");
const addressValidator = require("wallet-address-validator");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");

// Function to generate QRCode data URL
async function generateCryptoQr(address) {
  // Log the input address for debugging purposes
  console.log("Generating QR for address:", address);

  // Validate the address
  if (!address || typeof address !== 'string' || address.trim() === '') {
    console.error("Invalid address provided:", address); // Log the invalid address
    throw new Error("Invalid address provided to QR generation.");
  }
  
  try {
    const qrCodeData = await QRCode.toDataURL(address);
    return qrCodeData;
  } catch (error) {
    console.error("Error generating QR code:", error); // Log any errors during QR generation
    throw new Error("Failed to generate QR code.");
  }
}

/**
 * @route   GET /api/cashier/crypto/addresses
 * @desc    Get crypto addresses for all currencies
 * @access  Private
 */
router.get("/crypto/addresses", validateJWT, async (req, res, next) => {
  try {
    // Check if deposits are enabled
    const isEnabled = getDepositState();

    // If deposits are not enabled
    if (!isEnabled) {
      res.status(400);
      return next(new Error("Deposits are currently disabled! Contact admins for more information"));
    }

    const user = await User.findOne({ _id: req.user.id }).lean();

    // If user was not found
    if (!user) {
      return next(new Error("User not found! (database error)"));
    }

    // Check if user has created addresses
    if (user.crypto) {
      return res.json(user.crypto);
    }

    const networks = {
      btc: "Bitcoin",
      ltc: "Litecoin",
      eth: "ERC20",  // Ethereum network
      doge: "Dogecoin",
      usdt: ["ERC20", "TRC20", "BEP20"], // USDT can be on different networks
      usdc: ["ERC20", "BEP20"], // USDC on ERC20 and BEP20
      bnb: "BEP20", // BNB Smart Chain
      bch: "BitcoinCash", // Bitcoin Cash
      xmr: "Monero", // Monero
      shib: "BEP20", // Shiba Inu on BNB Smart Chain
      sol: "Solana", // Solana
      ton: "Ton", // The Open Network (TON)
    };

    // Generate deposit address for all currencies
    const addrs = await createDepositAddress();

    // Construct addresses object
    const addresses = {};

    // Loop through the generated addresses
    for (const coin in addrs) {
      addresses[coin] = { address: {} };

      // Check if the coin has a corresponding network in our mapping
      if (networks[coin.toLowerCase()]) {
        const networkInfo = networks[coin.toLowerCase()];

        if (Array.isArray(networkInfo)) {
          // Multi-network handling
          for (const network of networkInfo) {
            addresses[coin].address[network] = addrs[coin][network];
          }
        } else {
          // Single-network handling
          addresses[coin].address[networkInfo] = addrs[coin];
        }
      }
    }

    // Update user with new addresses
    await User.updateOne({ _id: req.user.id }, { $set: { crypto: addresses } });

    return res.json(addresses);
  } catch (error) {
    next(error);
  }
});

router.get("/crypto/wallet", validateJWT, async (req, res, next) => {
  try {
    // Check if deposits are enabled

    const user = await User.findOne({ _id: req.user.id }).lean();

    // If user was not found
    if (!user) {
      return next(new Error("User not found! (database error)"));
    }

    // Check if user has created addresses
    if (user.world) {
      return res.json(user.world);
    }


    return res.json(world);
  } catch (error) {
    next(error);
  }
});
/**
 * @route   POST /api/cashier/crypto/withdraw
 * @desc    Withdraw a currency
 * @access  Private
 */
router.post(
  "/crypto/withdraw",
  [
    validateJWT,
    check("network", "Network is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid network type"),
    check("currency", "Withdraw currency is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw currency type"),
    check("address", "Withdraw address is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw address type"),
    check("amount", "Withdraw amount is required")
      .notEmpty()
      .isFloat()
      .withMessage("Invalid Withdraw amount!")
      .toFloat(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currency, address, amount: cryptoAmount, network } = req.body;
    try {
      // Check if withdrawals are enabled
      const isEnabled = getWithdrawState();

      // If withdrawals are not enabled
      if (!isEnabled) {
        res.status(400);
        return next(
          new Error(
            "Withdraws are currently disabled! Contact admins for more information"
          )
        );
      }

      // Get current crypto rate and calculate USD value
      let usdAmount = cryptoAmount;
      try {
        const rate = await getCryptoRate(currency);
        if (rate && rate > 0) {
          usdAmount = cryptoAmount * rate; // Convert crypto amount to USD
        }
      } catch (error) {
        console.log("Error getting crypto rate:", error);
        return next(new Error("Error getting current exchange rate. Please try again."));
      }

      // Check that amount exceeds minimum withdraw amount in USD
      if (usdAmount < config.games.vip.minWithdrawAmount) {
        res.status(400);
        return next(new Error(`Minimum withdraw amount must be atleast $${config.games.vip.minWithdrawAmount}`));
      }

      // Get the latest user obj
      const user = await User.findOne({ _id: req.user.id });

      // Check that user is allowed to withdraw
      if (user.transactionsLocked) {
        res.status(403);
        return next(
          new Error(
            "Your account has a transaction restriction. Please contact support for more information."
          )
        );
      }

      // Check that user has enough balance in the specific currency
      if (!user.wallet?.[currency] || Math.abs(cryptoAmount) > user.wallet[currency].balance) {
        res.status(400);
        return next(new Error("Insufficient balance for this withdrawal!"));
      }

      // Check that user has wagered atleast 100% of his deposited amount
      if (user.wagerNeededForWithdraw > 0) {
        res.status(400);
        return next(new Error(`You must wager atleast $${user.wagerNeededForWithdraw.toFixed(2)} before withdrawing!`));
      }

      // If user has deposited less than $5.00 before withdrawing, check config file for amount
      if (user.totalDeposited < config.games.vip.minDepositForWithdraw) {
        res.status(400);
        return next(
          new Error(`You must have deposited atleast $${config.games.vip.minDepositForWithdraw} before withdrawing!`)
        );
      }

      // If user has wager limit, check if it's been passed
      if (user.wager < user.customWagerLimit) {
        res.status(400);
        return next(
          new Error(
            `Because your account has wager limit, you must wager still $${(
              user.customWagerLimit - user.wager
            ).toFixed(2)} before withdrawing!`
          )
        );
      }

      // Create a new document
      const newTransaction = new CryptoTransaction({
        type: "withdraw",
        currency,
        siteValue: usdAmount, // Store USD value
        cryptoValue: cryptoAmount, // Store original crypto amount
        address,
        network,
        txid: null,
        state: config.site.manualWithdrawsEnabled ? 4 : 1,
        _user: user.id,
      });

      // Update the balance for specific currency
      await User.updateOne(
        { _id: user.id },
        {
          $inc: {
            [`wallet.${currency}.balance`]: -Math.abs(cryptoAmount),
            totalWithdrawn: Math.abs(usdAmount),
          },
        }
      );
      insertNewWalletTransaction(
        user.id,
        -Math.abs(usdAmount),
        "Crypto withdraw",
        { transactionId: newTransaction.id }
      );

      // Save transaction first
      await newTransaction.save();

      // Only proceed with auto-withdrawal if manual withdraws are not enabled
      if (!config.site.manualWithdrawsEnabled) {
        try {
          // Create new payment using Coinbase
          const newPayment = await createWithdrawTransaction(
            currency.toLowerCase(),
            address,
            Math.abs(cryptoAmount),
            newTransaction.id
          );

          // Update transaction with payment info
          newTransaction.txid = newPayment.network.hash;
          await newTransaction.save();
        } catch (error) {
          console.log("Auto withdrawal failed:", error);
          // Change state to manual if auto-withdrawal fails
          newTransaction.state = 4;
          await newTransaction.save();
          
          console.log(
            colors.red(
              `Coinbase >> Error contacting API! Check payment manually! Debug info below:`
            )
          );

          // Construct debug info
          const debug = {
            "User ID": req.user.id,
            "Withdraw wallet address": address,
            "Withdraw amount": cryptoAmount,
            "Withdraw currency": currency,
          };

          // Print out debug information
          console.table(debug);
        }
      }

      return res.json({
        siteValue: newTransaction.siteValue,
        cryptoValue: newTransaction.cryptoValue,
        state: newTransaction.state,
        network: newTransaction.network
      });
    } catch (error) {
      console.log("Error while completing a withdraw:", error);

      // If the error was related to coinbase
      if (error.name === "ValidationError") {
        console.log(
          colors.red(
            `Coinbase >> Error contacting API! Check payment manually! Debug info below:`
          )
        );

        // Construct debug info
        const debug = {
          "User ID": req.user.id,
          "Withdraw wallet address": address,
          "Withdraw amount": cryptoAmount,
          "Withdraw currency": currency,
        };

        // Print out debug information
        console.table(debug);

        return next(
          new Error(
            "There was a problem while contacting our crypto provider. Please contact support to check your withdraw status!"
          )
        );
      } else {
        return next(error);
      }
    }
  }
);
