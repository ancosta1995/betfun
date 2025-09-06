const express = require('express');
const router = express.Router();
const axios = require('axios');

const MANIFOLD_API = 'https://api.manifold.markets/v0';

router.get('/', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const response = await axios.get(`${MANIFOLD_API}/markets`, {
      params: {
        limit,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const markets = response.data
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .map(market => ({
        id: market.id,
        question: market.question,
        creatorName: market.creatorName,
        creatorUsername: market.creatorUsername,
        creatorAvatarUrl: market.creatorAvatarUrl,
        createdTime: market.createdTime,
        closeTime: market.closeTime,
        probability: market.probability,
        volume: market.volume || 0,
        volume24Hours: market.volume24Hours || 0,
        totalLiquidity: market.totalLiquidity || 0,
        outcomeType: market.outcomeType,
        isResolved: market.isResolved,
        url: market.url,
        pool: market.pool,
        marketTier: market.marketTier,
        token: market.token,
        uniqueBettorCount: market.uniqueBettorCount || 0
      }));

    res.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch markets',
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router; 