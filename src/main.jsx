// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import global styles
import App from './App';
import { AuthProvider } from './context/AuthContext';  // Import the context provider
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Ensure that AuthProvider wraps the App component so the context is available globally
root.render(
  <StrictMode>
        <App />
  </StrictMode>
);
