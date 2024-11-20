// App.js

import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';
import logo from "./logo3.png";

function App() {
    // Initializing all the state variables
    const [currencies, setCurrencies] = useState([]);
    const [input, setInput] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('INR');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch list of available currencies
    useEffect(() => {
        Axios.get('https://api.exchangerate-api.com/v4/latest/USD')
            .then((res) => {
                setCurrencies(Object.keys(res.data.rates));
                setFrom('USD');
                setTo('INR');
                updateLastUpdated(res.data.time_last_updated);
            })
            .catch((error) => console.error(error));
    }, []);

    // Automatically convert currency when input, "From", or "To" changes
    useEffect(() => {
        if (from && to && input) {
            convertCurrency();
        }
    }, [from, to, input]);

    // Function to convert the currency
    const convertCurrency = () => {
        if (from && to) {
            Axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`)
                .then((res) => {
                    const rate = res.data.rates[to];
                    setConvertedAmount((input * rate).toFixed(4));
                    updateLastUpdated(res.data.time_last_updated);
                })
                .catch((error) => console.error(error));
        }
    };

    // Function to update the last updated time from the API timestamp
    const updateLastUpdated = (timestamp) => {
        const date = new Date(timestamp * 1000);
        setLastUpdated(date.toLocaleString());
    };

    // Function to switch between two currencies
    const flip = () => {
        var temp = from;
        setFrom(to);
        setTo(temp);
    };

    // Function to get the flag URL for a given currency code
    const getFlagUrl = (currency) => {
        return `https://flagcdn.com/w40/${currency.slice(0, 2).toLowerCase()}.png`;
    };

    return (
        <div className="App">
             <img src={logo} alt="Logo" className="logo" />
            <div className="heading">
                <h1>Currency Converter</h1>
            </div>
            <div className="container">
                <div className="left">
                    <h3>Amount</h3>
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 1 || value === "") {
                                setInput(value);
                            } else {
                                alert("Amount must be 1 or more!");
                            }
                        }}
                        placeholder="Enter the amount"
                    />
                </div>
                <div className="middle">
                    <h3>
                        From{' '}
                        <img
                            src={getFlagUrl(from)}
                            alt={from}
                            className="flag"
                        />
                    </h3>
                    <Dropdown
                        options={currencies}
                        onChange={(e) => setFrom(e.value)}
                        value={from}
                        placeholder="From"
                    />
                </div>
                <div className="switch">
                    <HiSwitchHorizontal size="30px" onClick={flip} />
                </div>
                <div className="right">
                    <h3>
                        To{' '}
                        <img
                            src={getFlagUrl(to)}
                            alt={to}
                            className="flag"
                        />
                    </h3>
                    <Dropdown
                        options={currencies}
                        onChange={(e) => setTo(e.value)}
                        value={to}
                        placeholder="To"
                    />
                </div>
            </div>
            <div className="result">
                <button onClick={convertCurrency}>Convert</button>
                {convertedAmount && (
                    <h2 className="result_amount">
                        {input} {from} = {convertedAmount} {to}
                    </h2>
                )}
            </div>
            {lastUpdated && (
                <div className="last-updated">
                    <p>Rates last updated: {lastUpdated}</p>
                </div>
            )}
            <div className="name">	&#169;&nbsp;Developed By Nikhil Faldu</div>
        </div>
        
    );
}

export default App;
