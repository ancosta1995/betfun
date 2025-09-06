import axios from 'axios';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const POLYMARKET_API = 'https://gamma-api.polymarket.com';

export const PolymarketService = {
  getMarkets: async ({ 
    limit = 20
  } = {}) => {
    try {
      const response = await axios.get(`${CORS_PROXY}${POLYMARKET_API}/markets`, {
        params: {
          limit
        },
        headers: {
          'Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // Format the data for our UI
      return response.data.map(market => ({
        id: market.id,
        title: market.question,
        category: market.tag?.name || 'Uncategorized',
        endTime: market.end_date,
        volume: market.volume_num || 0,
        liquidity: market.liquidity_num || 0,
        yesPrice: market.yes_price,
        noPrice: market.no_price,
        imageUrl: market.image_url,
        outcomes: market.outcomes || ['Yes', 'No'],
        slug: market.slug,
        isActive: market.active,
        isClosed: market.closed
      }));

    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  },

  // Get a single market by ID
  getMarketById: async (id) => {
    try {
      const response = await axios.get(`${POLYMARKET_API}/markets`, {
        params: { id }
      });
      
      if (response.data.length === 0) {
        throw new Error('Market not found');
      }

      const market = response.data[0];
      return {
        id: market.id,
        title: market.question,
        category: market.tag?.name || 'Uncategorized',
        endTime: market.end_date,
        volume: market.volume_num,
        liquidity: market.liquidity_num,
        yesPrice: market.yes_price,
        noPrice: market.no_price,
        imageUrl: market.image_url,
        outcomes: market.outcomes || ['Yes', 'No'],
        slug: market.slug,
        isActive: market.active,
        isClosed: market.closed
      };
    } catch (error) {
      console.error('Error fetching market:', error);
      throw error;
    }
  },

  // Get markets by category/tag
  getMarketsByTag: async (tagId) => {
    try {
      const response = await axios.get(`${POLYMARKET_API}/markets`, {
        params: {
          tag_id: tagId,
          related_tags: true,
          active: true
        }
      });

      return response.data.map(market => ({
        id: market.id,
        title: market.question,
        category: market.tag?.name || 'Uncategorized',
        endTime: market.end_date,
        volume: market.volume_num,
        liquidity: market.liquidity_num,
        yesPrice: market.yes_price,
        noPrice: market.no_price,
        imageUrl: market.image_url,
        outcomes: market.outcomes || ['Yes', 'No'],
        slug: market.slug,
        isActive: market.active,
        isClosed: market.closed
      }));
    } catch (error) {
      console.error('Error fetching markets by tag:', error);
      throw error;
    }
  }
}; 