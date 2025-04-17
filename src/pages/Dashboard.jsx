import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CompanyLogo from '../assets/company-logo.png';
import UserMenu from './UserMenu';
import LiveMetrics from '../components/LiveMetrics';
import LeftSidebar from '../components/LeftSidebar';
import ThemeToggle from '../components/ThemeToggle';
import ErrorBoundary from '../components/ErrorBoundary';
import SessionExpirePopup from '../components/SessionExpirePopup'; // Import the SessionExpirePopup
import './Dashboard.css';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, sessionExpired, timeRemaining, renewSession } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.trim().split(' ').map((n) => n[0].toUpperCase()).join('');
  };

  const updateTheme = (newTheme) => setTheme(newTheme);

  const handleSidebarToggle = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  // Display session time remaining in minutes and seconds
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="top-bar">
        {isMobile && (
          <IconButton onClick={handleSidebarToggle} className="menu-icon-button">
            <MenuIcon />
          </IconButton>
        )}
        <div className="logo-container">
          <img src={CompanyLogo} alt="Company Logo" className="company-logo" />
        </div>
        <div className="software-name">
          <h2>Energy Management System</h2>
        </div>
        
        <div className="session-timer">
          {sessionExpired ? (
            <span>Session Expired</span>
          ) : (
            <span>Session Remaining: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</span>
          )}
        </div>

        <div className="user-profile">
          <IconButton onClick={handleAvatarClick} className="user-avatar-button">
            {user?.photoURL ? (
              <Avatar src={user.photoURL} alt={user.name} />
            ) : (
              <Avatar>{getInitials(user?.name)}</Avatar>
            )}
          </IconButton>
          <UserMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </div>

      <div className="main-layout">
        {(isSidebarExpanded || !isMobile) && (
          <LeftSidebar isExpanded={true} onSidebarToggle={handleSidebarToggle} />
        )}
        <div className="center-content">
          <Outlet />
        </div>
        {!isMobile && (
          <ErrorBoundary>
            <div className="right-sidebar">
              <LiveMetrics theme={theme} />
            </div>
          </ErrorBoundary>
        )}
      </div>

      {/* Show the session expiry popup when session is expired */}
      {sessionExpired && <SessionExpirePopup renewSession={renewSession} logout={handleLogout} />}
    </div>
  );
};

export default Dashboard;
