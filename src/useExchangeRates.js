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
  const generateDates = (numDays) => {
    const dates = [];
    const today = new Date();
    const beforeOneDay  = today.setDate(today.getDate() - 1)
    for (let i = 0; i < numDays; i++) {
      const date = new Date(beforeOneDay);
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
  // const [fetchedCurrencies, setFetchedCurrencies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      console.log(loading)
      if(loading)return false
      setLoading(true);
      try {
      
        // let currenciesToFetch = selectedCurrencies.reduce((acc,item)=>{
        //   if(!fetchedCurrencies.includes(item)){
        //     acc.push(item)
        //   }
        //   return acc
        // },[])
        // if(currenciesToFetch.length === 0){
        //     return false
        // }
        const dates = generateDates(7); // Function to generate 7 days of dates
        const ratesResponse = await Promise.all(
          dates.map(async (date) =>{
            return (await freecurrencyapi.historical({ date: date, currencies: selectedCurrencies }))
          })
          
        );
        const currenciesResponse = await freecurrencyapi.currencies();
        setAvailableCurrencies(currenciesResponse.data);
         const responseData = ratesResponse.reduce((response,currentdata) => {
          const cData = currentdata.data
          const key = Object.keys(cData)[0]
          response[key] = currentdata.data[key]
        return response
        },{});
        
  
         const colData = selectedCurrencies.reduce((prvData,curData)=>{
              
              const datesData = dates.map((date)=>{
                const valObj = {}
                valObj[date] = responseData[date][curData]
                return valObj
              })
              prvData[curData] = datesData
              return prvData
            },{})
        setExchangeRates(colData);
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
