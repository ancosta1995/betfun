import React, { useEffect, createContext, useState, useContext } from 'react';
import { GetCurrency } from "../services/api.service";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [selectedLogo, setSelectedLogo] = useState('https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=022');
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('USD');
  const [DisplayInFiatt, setDisplayInFiatt] = useState('false');

  const updateCurrency = (currency, logo) => {
    setSelectedCurrency(currency);
    setSelectedLogo(logo);
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetCurrency();
        console.log(response);  // Check what the response looks like
        
        // Assuming the response is in the format { FiatCurrency, Currency, DisplayInFiat }
        if (response) {
          setSelectedCurrency(response.Currency);
        }
      } catch (error) {
        console.log("There was an error while loading active case data:", error);
      }
    };

    // Call the async function
    fetchData();
  }, []); // Empty dependency array to ensure it only runs on component mount

  const updateFiatCurrency = (fiatCurrency) => {
    setSelectedFiatCurrency(fiatCurrency);
  };
  const updateDisplayInFiatt = (display) => {
    setDisplayInFiatt(display);
  };
  return (
    <CurrencyContext.Provider value={{ selectedCurrency, selectedLogo, updateCurrency, selectedFiatCurrency, updateFiatCurrency, DisplayInFiatt, updateDisplayInFiatt}}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
