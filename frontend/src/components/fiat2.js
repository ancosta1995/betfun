const fs = require('fs');

async function fetchAndSaveFiatPrices() {
  const query = `
    query getAppSettingAndPrices {
      fiatPrices {
        name
        price
        __typename
      }
    }
  `;

  try {
    const response = await fetch('https://shuffle.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Origin': 'https://shuffle.com',
        'Referer': 'https://shuffle.com/settings/preferences',
      },
      body: JSON.stringify({
        operationName: "getAppSettingAndPrices",
        query
      }),
    });

    // Parse the response as JSON
    const result = await response.json();

    // Check if the result has the expected structure
    if (result && result.data && result.data.fiatPrices) {
      const fiatPrices = result.data.fiatPrices;

      // Save fiatPrices to a JSON file
      fs.writeFileSync('fiatPrices.json', JSON.stringify(fiatPrices, null, 2), 'utf-8');

      console.log('fiatPrices saved to fiatPrices.json');
    } else {
      // Log the entire result to understand its structure
      console.error('Unexpected result structure:', result);
    }
  } catch (error) {
    console.error('Error fetching fiat prices:', error);
  }
}

fetchAndSaveFiatPrices();
