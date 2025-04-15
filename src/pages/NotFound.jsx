// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFound.css';
import CompanyLogo from '../assets/company-logo.png';

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useAuth();

  return (
    <div className={`notfound-container ${theme}`}>
      <div className="ghost-wrapper">
        <div className="ghost">
          <div className="face">
            <div className="eye"></div>
            <div className="eye right"></div>
            <div className="mouth"></div>
          </div>
        </div>
      </div>
      <div className="notfound-box">
        <img src={CompanyLogo} alt="company-logo" className="company-logo" />
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">Oops! The page you're looking for doesn't exist.</p>
        <button className="notfound-button" onClick={() => navigate('/login')}>
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
