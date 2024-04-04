import { useState, useEffect } from 'react';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

const API_KEY = 'fca_live_jhzOtl5uvgaZ8a7JLisbxc5rUpDK8sBARGQ7TQcO';
const freecurrencyapi = new Freecurrencyapi(API_KEY);
// getYesterdayDate Function to get yesterday's date because we are not able to get today's data.
function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}
const generateDates = (numDays,selectedDate) => {
  const dates = [];
  const today = new Date();
  const beforeOneDay  = today.setDate(today.getDate() - 1)
  for (let i = 0; i < numDays; i++) {
    const date = new Date(selectedDate ? selectedDate : beforeOneDay);

    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};
function useExchangeRates(initialBaseCurrency = 'USD', initialSelectedCurrencies = ['GBP', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'INR'], initialDate = getYesterdayDate()) {
  
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const [selectedCurrencies, setSelectedCurrencies] = useState(initialSelectedCurrencies);
  const [exchangeRates, setExchangeRates] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState({});
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const dates = generateDates(7,selectedDate); // Function to generate 7 days of dates
        const ratesResponse = await Promise.all(
          dates.map(async (date) =>{
            return (await freecurrencyapi.historical({ date: date, currencies: selectedCurrencies,base_currency:baseCurrency }))
          })
          
        );
        const currenciesResponse = await freecurrencyapi.currencies().then((response) => response.data);
        setAvailableCurrencies(currenciesResponse);
         const responseData = ratesResponse.reduce((response,currentdata) => {
          const cData = currentdata.data
          const key = Object.keys(cData)[0]
          response[key] = currentdata.data[key]
        return response
        },{});
        
         const exchangeRatesData = selectedCurrencies.reduce((allData,currentData)=>{
              const datesData = dates.map((date)=>{
                const exchangeRatesDataHolder = {}
                exchangeRatesDataHolder[date] = responseData[date][currentData]
                return exchangeRatesDataHolder
              })
              allData[currentData] = datesData
              return allData
            },{})
        setExchangeRates(exchangeRatesData);
        setLoading(false);
        setError('');
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    if(!loading){
      fetchData();
    }
    
  }, [selectedCurrencies,selectedDate,baseCurrency]);

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
  console.log('call API')
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
