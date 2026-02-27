import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './GoalTogether.jsx'

// Polyfill for window.storage
if (!window.storage) {
    window.storage = {
        get: async (key) => {
            const value = localStorage.getItem(key);
            return value ? { value } : null;
        },
        set: async (key, value) => {
            localStorage.setItem(key, value);
        }
    };
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
