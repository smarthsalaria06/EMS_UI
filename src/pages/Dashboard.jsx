import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconButton, Avatar } from '@mui/material';
import CompanyLogo from '../assets/company-logo.png';
import UserMenu from './UserMenu';
import LiveMetrics from '../components/LiveMetrics';
import LeftSidebar from '../components/LeftSidebar'; // ✅ New Sidebar component
import './Dashboard.css';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // Import ThemeToggle
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Track sidebar expanded state
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  // Toggle sidebar expanded state on hover or click
  const handleSidebarToggle = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className={`dashboard-container ${theme}`}>
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
      </div>

      <div className="main-layout">
        <LeftSidebar isExpanded={isSidebarExpanded} onSidebarToggle={handleSidebarToggle} />
        <div className="center-content">
          <Outlet />
        </div>
        <ErrorBoundary>
        <div className="right-sidebar">
          <LiveMetrics theme={theme} />
        </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;
