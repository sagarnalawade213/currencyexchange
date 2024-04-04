import React from 'react';
import useExchangeRates from './useExchangeRates';

function App() {
  const {
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
  } = useExchangeRates();

  const ExchangeRatesTD = (curr)=>{
   const returnData =  exchangeRates[curr.data]?.map((item)=>{
      let key = Object?.keys(item)[0]
      return(<li>
        <div><strong>Date: </strong><span>{key} </span></div>
        <div><strong>Rate: </strong><span> {item[key]}</span></div>
        </li>)
  })
    return(<ul className='data-list'>{returnData}</ul>) 
  }
  return (
    <div className='mainWrapper'>
      <h1>Check Exchange Rates</h1>
      {loading && <p>Loading...</p>}
      
      <div className='topWrapper'>
        <div className='baseCurrencyDropdown'>
          <label htmlFor="baseCurrency">Base Currency: </label>
          <select id='baseCurrency' value={baseCurrency} onChange={handleBaseCurrencyChange} className='dropdown'>
            {availableCurrencies && Object.keys(availableCurrencies).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className='dateWrapper baseCurrencyDropdown'>
          <label htmlFor="selectedDate">Select Date: </label>
          <input type="date" id="selectedDate" value={selectedDate} onChange={handleDateChange} className='datePicker'/>
        </div>
      </div>
      <div>
        <h2>Add Currency:</h2>
        <ul className='currencyList'>
          {availableCurrencies && Object.keys(availableCurrencies).map(currency => (
            <li key={currency}>
              <button onClick={() => handleAddCurrency(currency)} disabled={selectedCurrencies.includes(currency)}>
                {currency}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {error && <p>Error: {error}</p>}
      <table className='exchangeTable'>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Exchange Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedCurrencies.map(currency => (
            <tr key={currency}>
              <td><h4>{currency}</h4></td>
              <td><ExchangeRatesTD data={currency} /></td>
              <td>
                <button onClick={() => handleRemoveCurrency(currency)} className='glowing-btn'>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
}

export default App;
