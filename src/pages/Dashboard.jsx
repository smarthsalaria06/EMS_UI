import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconButton, Avatar } from '@mui/material';
import CompanyLogo from '../assets/company-logo.png';
import UserMenu from './UserMenu'; // User will share later
import LiveMetrics from '../components/LiveMetrics';
import LeftSidebar from '../components/LeftSidebar'; // ✅ New Sidebar component
import './Dashboard.css';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // Import ThemeToggle

const Dashboard = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [theme, setTheme] = useState('light'); // Manage theme state here

  const navigate = useNavigate();

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => navigate('/');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .trim()
      .split(' ')
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  // Update theme state when theme changes
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    // Retrieve theme from localStorage or default to light
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src={CompanyLogo} alt="Company Logo" className="company-logo" />
        </div>
        <div className="software-name">
          <h2>Energy Management System</h2>
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

        {/* Theme toggle */}
        
      </div>

      {/* Layout */}
      <div className="main-layout">
        <LeftSidebar /> {/* ✅ Sidebar Component */}

        {/* Main Content */}
        <div className="center-content">
          <Outlet />
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <LiveMetrics theme={theme} /> {/* Pass the theme prop to LiveMetrics */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
