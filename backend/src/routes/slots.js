const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const config = require("../config");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const axios = require('axios');
const BetHistory = require("../models/BetHistory");

const TBS_API_URL = 'https://betfun.gg:2053/api/slots/tbs';

// Load price data
const loadPrices = () => {
    const pricesPath = path.join(__dirname, '../../Prices.json');
    return JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
};

// Genelleştirilmiş para birimi dönüşüm fonksiyonu
const convertCurrency = (amount, fromCurrency, toCurrency, prices) => {
    // Aynı para birimiyse olduğu gibi döndür
    if (fromCurrency === toCurrency) return amount;
    
    // Kaynak para birimi için oran
    const fromRate = prices[fromCurrency] ? prices[fromCurrency]['USD'] : null;
    
    // Hedef para birimi için oran
    const toRate = prices[toCurrency] ? prices[toCurrency]['USD'] : null;
    
    if (!fromRate || !toRate) {
        console.error(`Conversion rate not found: ${fromCurrency} to ${toCurrency}`);
        return 0;
    }

    // USD üzerinden dönüşüm
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    return convertedAmount;
};

// Eski convertToBTC fonksiyonunu bu yeni fonksiyon değiştirecek
const convertToBTC = (amount, fromCurrency, prices) => {
    return convertCurrency(amount, fromCurrency, 'BTC', prices);
};

// Extract currency from username
const extractCurrencyFromUsername = (username) => {
    const parts = username.split('_');
    return parts.length > 1 ? parts[1].toUpperCase() : 'BTC';
};

// Get user balance from wallet with currency conversion
const getUserBalance = async (username, requestedCurrency) => {
    try {
        const prices = loadPrices();
        const baseCurrency = extractCurrencyFromUsername(username);
        const user = await User.findOne({ username: username.split('_')[0] });
        
        if (!user) {
            console.error(`User not found: ${username}`);
            return 0;
        }

        // Check if wallet and currency exist
        if (!user.wallet || !user.wallet[baseCurrency]) {
            console.error(`Wallet or currency not found: ${baseCurrency}`);
            return 0;
        }

        // Get balance in base currency
        const baseBalance = parseFloat(user.wallet[baseCurrency].balance);
        
        // If no conversion needed, return base balance in cents
        if (baseCurrency === requestedCurrency) {
            return Math.floor(baseBalance * 100);
        }

        // Convert balance to requested currency
        const btcAmount = convertToBTC(baseBalance, baseCurrency, prices);
        const convertedAmount = btcAmount * prices['BTC'][requestedCurrency];
        
        // Convert to cents
        return Math.floor(convertedAmount * 100);
    } catch (error) {
        console.error("Balance lookup error:", error);
        return 0;
    }
};

// Update user balance with currency conversion
const updateUserBalance = async (username, amount, isCredit = false, requestedCurrency = null) => {
    try {
        const prices = loadPrices();
        const baseCurrency = extractCurrencyFromUsername(username);
        const user = await User.findOne({ username: username.split('_')[0] });
        
        if (!user) {
            console.error(`User not found: ${username}`);
            return false;
        }

        // 0 miktarında hiçbir işlem yapma
        if (amount === 0) {
            console.log('Zero amount transaction, skipping balance update');
            return true;
        }

        // Hedef para birimini belirle
        const targetCurrency = requestedCurrency || baseCurrency;

        // Miktarı decimal'e çevir
        const amountInDecimal = amount / 100;

        // Debug logging
        console.log('Detailed Balance Update Debug:', {
            username,
            amount,
            isCredit,
            baseCurrency,
            targetCurrency,
            amountInDecimal,
            currentWallet: user.wallet
        });

        // Wallet kontrolü ve güvenli bakiye alma
        if (!user.wallet || !user.wallet[baseCurrency]) {
            console.error('Wallet or currency not found', {
                username,
                baseCurrency,
                wallet: user.wallet
            });
            return false;
        }

        const currentBalance = parseFloat(user.wallet[baseCurrency].balance || '0');

        // Döviz kuru kontrolü
        if (!prices[baseCurrency] || !prices[targetCurrency]) {
            console.error('Conversion rates missing', {
                baseCurrency,
                targetCurrency,
                availableCurrencies: Object.keys(prices)
            });
            return false;
        }

        let balanceChange;

        // USD için özel kontrol
        if (baseCurrency === 'USD') {
            // USD cinsinden işlem
            if (targetCurrency === 'USD') {
                balanceChange = isCredit ? amountInDecimal : -amountInDecimal;
            } else {
                // Diğer para birimlerinden USD'ye çevirme
                const targetToUsdRate = prices[targetCurrency]['USD'];
                const usdAmount = amountInDecimal / targetToUsdRate;
                balanceChange = isCredit ? usdAmount : -usdAmount;
            }
        } else {
            // Diğer para birimleri için normal dönüşüm
            const baseToUsdRate = prices[baseCurrency]['USD'];
            const targetToUsdRate = prices[targetCurrency]['USD'];
            const usdAmount = amountInDecimal / targetToUsdRate;
            const baseCurrencyAmount = usdAmount / baseToUsdRate;
            balanceChange = isCredit ? Math.abs(baseCurrencyAmount) : -Math.abs(baseCurrencyAmount);
        }

        // Yeni bakiyeyi hesapla
        const newBalance = currentBalance + balanceChange;
        
        // Negatif bakiye kontrolü
        if (newBalance < 0) {
            console.error(`Insufficient balance: Current ${currentBalance}, Change ${balanceChange}`);
            return false;
        }

        // Bakiyeyi güvenli bir şekilde güncelle
        const safeBalance = Number(newBalance.toFixed(8));
        
        // Wallet'ı güncellerken doğru yapıyı kullan
        user.wallet[baseCurrency].balance = safeBalance.toString();

        await user.save();
        console.log('Balance updated definitively:', {
            username,
            baseCurrency,
            targetCurrency,
            oldBalance: currentBalance,
            newBalance: safeBalance,
            balanceChange,
            originalAmount: amountInDecimal
        });

        return true;
    } catch (error) {
        console.error("Balance update catastrophic error:", error);
        return false;
    }
};

// Validate callback signature
const validateSignature = (params, saltKey) => {
    const { timestamp, key } = params;
    const computedKey = crypto.createHash('md5').update(timestamp + saltKey).digest('hex');
    return computedKey === key;
};

// Optional: Signature verification function
function verifySignature(data, hallKey) {
  const dataForSign = { ...data };
  delete dataForSign.sign; // Remove sign from data if exists
  
  const sortedData = {};
  Object.keys(dataForSign).sort().forEach(key => {
    sortedData[key] = dataForSign[key];
  });
  
  const dataArray = Object.values(sortedData);
  dataArray.push(hallKey);
  const dataString = dataArray.join(':');
  
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

router.get('/gate', async (req, res) => {
    try {
        console.log("GET Request - Gate Endpoint");
        console.log("Request Query Parameters:", req.query);

        const { 
            username, 
            currency, 
            action, 
            game_id, 
            call_id, 
            timestamp, 
            key 
        } = req.query;



        // Handle different callback actions
        switch (action) {
            case 'balance':
                try {
                    const balance = await getUserBalance(username, currency || 'USD');
                    res.status(200).json({
                        error: 0,
                        balance: balance // Balance in cents of requested currency
                    });
                } catch (balanceError) {
                    console.error("Balance lookup error:", balanceError);
                    res.status(200).json({
                        error: 2,
                        balance: 0
                    });
                }
                break;

            case 'debit':
                try {
                    const { amount, type, gameplay_final, round_id } = req.query;
                    
                    const currentBalance = await getUserBalance(username, currency || 'USD');
                    
                    // Check if sufficient balance (for non-bonus spins)
                    if (type !== 'bonus_fs' && currentBalance < parseInt(amount)) {
                        return res.status(200).json({
                            error: 1,
                            balance: currentBalance
                        });
                    }

                    // Deduct balance if not a bonus spin
                    if (type !== 'bonus_fs') {
                        await updateUserBalance(username, parseInt(amount), false, currency);
                    }
                    
                    const newBalance = await getUserBalance(username, currency || 'USD');
                    
                    res.status(200).json({
                        error: 0,
                        balance: newBalance
                    });
                } catch (debitError) {
                    console.error("Debit error:", debitError);
                    res.status(200).json({
                        error: 2,
                        balance: 0
                    });
                }
                break;

            case 'credit':
                try {
                    const { amount, type, round_id } = req.query;
                    
                    await updateUserBalance(username, parseInt(amount), true, currency);
                    
                    const newBalance = await getUserBalance(username, currency || 'USD');
                    
                    res.status(200).json({
                        error: 0,
                        balance: newBalance
                    });
                } catch (creditError) {
                    console.error("Credit error:", creditError);
                    res.status(200).json({
                        error: 2,
                        balance: 0
                    });
                }
                break;

            default:
                console.warn("Unhandled action:", action);
                res.status(200).json({
                    error: 2,
                    balance: 0
                });
        }
    } catch (error) {
        console.error("Gate Endpoint Error:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Main TBS API handler
router.post('/tbs', async (req, res) => {
  try {
    const { cmd, login, hall, key, sessionId, bet, win, tradeId } = req.body;
    const baseCurrency = 'USD';

    // Log incoming request
    console.log('TBS API Request:', {
      cmd,
      login,
      sessionId,
      tradeId
    });

    switch (cmd) {
      case 'getBalance':
        // Find user
        const user = await User.findOne({ username: login });
        if (!user) {
          return res.json({
            status: 'fail',
            error: 'user_not_found'
          });
        }

        // Get balance from USD wallet
        if (!user.wallet || !user.wallet[baseCurrency]) {
          return res.json({
            status: 'success',
            error: '',
            login: user.username,
            balance: '0.00',
            currency: baseCurrency
          });
        }

        const walletBalance = parseFloat(user.wallet[baseCurrency].balance || 0);

        return res.json({
          status: 'success',
          error: '',
          login: user.username,
          balance: walletBalance.toFixed(2),
          currency: baseCurrency
        });

      case 'writeBet':
        // Validate required parameters
        if (!login || !sessionId || !bet || !win || !tradeId) {
          return res.json({
            status: 'fail',
            error: 'missing_parameters'
          });
        }

        // Find user
        const betUser = await User.findOne({ username: login });
        if (!betUser) {
          return res.json({
            status: 'fail',
            error: 'user_not_found'
          });
        }

        // Initialize wallet if doesn't exist
        if (!betUser.wallet) {
          betUser.wallet = {
            [baseCurrency]: { balance: '0' }
          };
        }
        if (!betUser.wallet[baseCurrency]) {
          betUser.wallet[baseCurrency] = { balance: '0' };
        }

        // Get current balance from USD wallet
        const currentBalance = parseFloat(betUser.wallet[baseCurrency].balance || 0);

        // Parse bet and win amounts
        const betAmount = parseFloat(bet);
        const winAmount = parseFloat(win);

        // Skip balance check if it's a refund
        const isRefund = req.body.betInfo === 'refund';
        
        // Check balance if not a refund
        if (!isRefund && currentBalance < betAmount) {
          return res.json({
            status: 'fail',
            error: 'fail_balance'
          });
        }

        // Calculate new balance
        let newBalance = currentBalance;
        
        if (!isRefund) {
          // Subtract bet amount
          newBalance -= betAmount;
          
          // Add win amount if any
          if (winAmount > 0) {
            newBalance += winAmount;
          }
        } else {
          // For refunds, just add the win amount
          newBalance += winAmount;
        }

        // Update USD wallet balance
        betUser.wallet[baseCurrency].balance = newBalance.toString();

        // Save the updated user
        const updatedUser = await betUser.save();

        // Save bet history
        const status = winAmount > 0 ? 'WIN' : 'LOSE';
        let multiplier = '0';
        
        // Calculate multiplier only if there's a valid bet amount
        if (betAmount > 0) {
            if (winAmount > 0) {
                multiplier = (winAmount / betAmount).toFixed(2);
            } else {
                multiplier = '0.00';
            }
        }

        // Skip recording bets with 0 bet amount
        if (betAmount > 0) {
            const betHistory = new BetHistory({
                user: betUser.username,
                game: "Slots",
                betAmount: betAmount,
                multiplier: multiplier,
                payout: status === 'WIN' ? (winAmount + betAmount).toFixed(2) : (-betAmount).toFixed(2),
                currency: baseCurrency,
                status: status,
                timestamp: new Date().toLocaleTimeString()
            });

            await betHistory.save();

            // Emit live bet update
            const io = req.app.get('socketio');
            if (io) {
                io.of("/chat").emit("live-bet-update", {
                    user: betUser.username,
                    game: "Slots",
                    betAmount: betAmount,
                    multiplier: multiplier,
                    payout: status === 'WIN' ? (winAmount + betAmount).toFixed(2) : (-betAmount).toFixed(2),
                    currency: baseCurrency,
                    timestamp: new Date().toLocaleTimeString(),
                    status: status
                });
            }
        }

        // Log the transaction
        console.log(`
          Transaction Log:
          User: ${login}
          Currency: ${baseCurrency}
          Session ID: ${sessionId}
          Trade ID: ${tradeId}
          Bet: ${betAmount}
          Win: ${winAmount}
          Previous Balance: ${currentBalance}
          New Balance: ${newBalance}
          Action: ${req.body.action || 'N/A'}
          Round Finished: ${req.body.round_finished || 'N/A'}
          Game ID: ${req.body.gameId || 'N/A'}
          ${isRefund ? '(REFUND)' : ''}
        `);

        return res.json({
          status: 'success',
          error: '',
          login: updatedUser.username,
          balance: newBalance.toFixed(2),
          currency: baseCurrency
        });

      default:
        return res.json({
          status: 'fail',
          error: 'invalid_command'
        });
    }

  } catch (error) {
    console.error('TBS API Error:', error);
    return res.json({
      status: 'fail',
      error: 'internal_error'
    });
  }
});

module.exports = router;
