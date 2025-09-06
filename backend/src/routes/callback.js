// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const crypto = require("crypto");
const colors = require("colors");
const config = require("../config");

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const axios = require("axios");

/**
 * @route   POST /api/callback/
 * @desc   
 * @access  Public`
 */
router.post("/", async (req, res, next) => {
  let data = req.body;
  console.log("Received callback data:", JSON.stringify(data, null, 2));

  const apiSecretKey = config.authentication.oaxpay.merchant_id;
  const hmacHeader = req.headers['hmac'];
  const calculatedHmac = crypto.createHmac('sha512', apiSecretKey).update(JSON.stringify(data)).digest('hex');

  if (calculatedHmac === hmacHeader) {
    if(data.status == "Paid") {
      const address = data.address;
      const currency = data.currency;
      const amount = data.amount;
      const txid = data.txID;
      const network = data.network || '';
      
      console.log(
        colors.blue("0xapay >> Processing deposit:"),
        colors.cyan(`${amount} ${currency} (${network}) to address ${address}`)
      );
      
      try {
        // Get USD value of the crypto amount
        const usdAmount = await axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=USD`
        ).then(res => res.data.USD * amount);
        
        const siteValue = usdAmount.toFixed(2);
        
        // Find user with the given crypto address
        // This is more complex due to the nested structure
        let user;
        
        if (currency.toLowerCase() === 'usdt' || currency.toLowerCase() === 'usdc') {
          // For tokens with multiple networks, we need to check each network
          const networkKey = network.toUpperCase(); // e.g., "TRC20", "BEP20", "ERC20"
          user = await User.findOne({
            [`crypto.${currency.toLowerCase()}.address.${networkKey}`]: address
          });
          console.log(user)
          if (!user) {
            console.log(colors.yellow(`Trying different network paths for ${currency}...`));
            // Try finding by direct network key if initial query fails
            user = await User.findOne({
              $or: [
                { [`crypto.${currency.toLowerCase()}.address.TRC20`]: address },
                { [`crypto.${currency.toLowerCase()}.address.ERC20`]: address },
                { [`crypto.${currency.toLowerCase()}.address.BEP20`]: address }
              ]
            });
          }
        } else if (currency.toLowerCase() === 'eth') {
          // Ethereum may have "ERC20" nested
          user = await User.findOne({
            $or: [
              { [`crypto.eth.address.ERC20`]: address },
              { [`crypto.eth.address`]: address }
            ]
          });
        } else if (currency.toLowerCase() === 'bnb') {
          // BNB may have "BEP20" nested
          user = await User.findOne({
            $or: [
              { [`crypto.bnb.address.BEP20`]: address },
              { [`crypto.bnb.address`]: address }
            ]
          });
        } else {
          // For other currencies, try both direct and nested address fields
          const lowerCurrency = currency.toLowerCase();
          user = await User.findOne({
            $or: [
              { [`crypto.${lowerCurrency}.address.${lowerCurrency.charAt(0).toUpperCase() + lowerCurrency.slice(1)}`]: address },
              { [`crypto.${lowerCurrency}.address`]: address }
            ]
          });
          
          if (!user) {
            // Fallback to a more general query
            const query = { $text: { $search: address } };
            user = await User.findOne(query);
          }
        }

        if (!user) {
          console.error(colors.red(`User not found for address: ${address} (${currency} ${network})`));
          console.log(colors.yellow("0xapay >> Deposit pending2!"), data);
          return res.status(200).send('OK'); // Return OK but log the issue
        }
   
        // Create transaction record
        const newTransaction = new CryptoTransaction({
          type: "deposit",
          currency, 
          siteValue: siteValue,
          cryptoValue: amount,
          address: address,
          network: network,
          txid: txid,
          state: 3,
          _user: user._id,
        });
        await newTransaction.save();

        // Update user's wallet
        try {
          // Check if wallet structure exists
          if (!user.wallet || typeof user.wallet !== 'object') {
            // Initialize wallet if it doesn't exist
            await User.updateOne(
              { _id: user._id }, 
              { $set: { wallet: { USD: { balance: 0 } } } }
            );
          }
          
          // Increment USD balance
          await User.updateOne(
            { _id: user._id }, 
            { $inc: { "wallet.USD.balance": parseFloat(siteValue) } }
          );
          
          // Log transaction
          await insertNewWalletTransaction(
            user._id, 
            parseFloat(siteValue), 
            `${currency} ${network ? '(' + network + ')' : ''} Deposit`
          );

          console.log(
            colors.green("0xapay >> Deposit verified! Added"),
            colors.cyan(`${amount} ${currency} and ${siteValue} USD to`),
            colors.green(user.username)
          );
        } catch (walletError) {
          console.error(colors.red("Error updating wallet:"), walletError);
          // The transaction is still saved, so we'll return OK
        }

        res.status(200).send('OK');
      } catch (error) {
        console.error(colors.red("Error processing deposit:"), error);
        res.status(200).send('OK'); // Still return OK to acknowledge receipt
      }
    } else {
      console.log(
        colors.blue("0xapay >> Deposit pending! " + data.amount + " " + data.currency + "."),
      );
      res.status(200).send('OK');
    }
  } else {
    res.status(400).send('Invalid HMAC signature');
  }
});