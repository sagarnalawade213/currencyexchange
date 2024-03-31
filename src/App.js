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
  return (
    <div className='mainWrapper'>
      <h1>Exchange Rates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className='baseCurrencyDropdown'>
        <label htmlFor="baseCurrency">Base Currency: </label>
        <select id="baseCurrency" value={baseCurrency} onChange={handleBaseCurrencyChange} className='dropdown'>
          {Object.keys(availableCurrencies).map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="selectedDate">Select Date: </label>
        <input type="date" id="selectedDate" value={selectedDate} onChange={handleDateChange} className='datePicker'/>
      </div>
      <div>
        <h2>Add Currency:</h2>
        <ul className='currencyList'>
          {Object.keys(availableCurrencies).map(currency => (
            <li key={currency}>
              <button onClick={() => handleAddCurrency(currency)} disabled={selectedCurrencies.includes(currency)}>
                {currency}
              </button>
            </li>
          ))}
        </ul>
      </div>
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
              <td>{currency}</td>
              <td>{ exchangeRates[currency] }</td>
              <td>
                <button onClick={() => handleRemoveCurrency(currency)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
}

export default App;
