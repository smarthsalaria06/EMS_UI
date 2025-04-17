import React, { useState } from 'react';
import { IconButton, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { isMobile } from 'react-device-detect';
import { CSVLink } from 'react-csv';  // For CSV export
import LiveMetricsMobile from './LiveMetricsMobile'; // Mobile version of live metrics
import CompanyLogo from '../assets/company-logo.png';
import UserMenu from './UserMenu';  // Assume this works in mobile version as well
import './MobileDashboard.css';  // Import the Mobile CSS

const MobileDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Example CSV data (replace with actual data)
  const csvData = [
    { metric: 'Temperature', value: '75°F' },
    { metric: 'Humidity', value: '60%' },
    { metric: 'Wind Speed', value: '5 mph' },
  ];

  const getInitials = (name) => name?.split(' ').map((n) => n[0].toUpperCase()).join('') || 'U';

  return (
    <div className="mobile-dashboard">
      {/* Header */}
      <div className="mobile-header">
        <IconButton onClick={toggleSidebar} className="menu-icon">
          <MenuIcon />
        </IconButton>
        <div className="logo-container">
          <img src={CompanyLogo} alt="Company Logo" className="company-logo" />
        </div>
        <div className="user-profile">
          <IconButton onClick={handleAvatarClick} className="user-avatar-button">
            <Avatar>{getInitials('John Doe')}</Avatar>
          </IconButton>
          <UserMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>X</button>
        {/* Sidebar content */}
        <ul>
          <li>Dashboard</li>
          <li>Metrics</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <LiveMetricsMobile />
        
        {/* CSV Export Button */}
        <div className="csv-export">
          <CSVLink data={csvData} filename="metrics_data.csv">
            <Button variant="contained">Export to CSV</Button>
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
