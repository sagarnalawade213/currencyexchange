import { useState, useEffect } from 'react';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

const API_KEY = 'fca_live_PICKSir9Jij6j5STnMFIcR8YFriZzshjNuHLsGLM';
const freecurrencyapi = new Freecurrencyapi(API_KEY);
function getYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
  }
function useExchangeRates(initialBaseCurrency = 'USD', initialSelectedCurrencies = ['GBP', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'INR'], initialDate = getYesterdayDate()) {
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const [selectedCurrencies, setSelectedCurrencies] = useState(initialSelectedCurrencies);
  const [exchangeRates, setExchangeRates] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState({});
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [currenciesResponse, ratesResponse] = await Promise.all([
          freecurrencyapi.currencies({ date: selectedDate, base_currency: baseCurrency}),
          freecurrencyapi.historical({ date: selectedDate, base_currency: baseCurrency })
        ]);
        setAvailableCurrencies(currenciesResponse.data);
        setExchangeRates(ratesResponse.data[selectedDate]);
        setLoading(false);
        setError('')
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [baseCurrency, selectedDate]);

  const handleBaseCurrencyChange = event => {
    setBaseCurrency(event.target.value);
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  const handleAddCurrency = currency => {
    if (!selectedCurrencies.includes(currency) && selectedCurrencies.length < 7) {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  const handleRemoveCurrency = currency => {
    if (selectedCurrencies.length > 3) {
      setSelectedCurrencies(selectedCurrencies.filter(curr => curr !== currency));
    }
  };

  return {
    baseCurrency,
    selectedCurrencies,
    exchangeRates,
    availableCurrencies,
    selectedDate,
    loading,
    error,
    handleBaseCurrencyChange,
    handleDateChange,
    handleAddCurrency,
    handleRemoveCurrency
  };
}

export default useExchangeRates;
