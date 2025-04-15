import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Settings,
  DataUsage,
  Alarm,
  TrendingUp,
  Report
} from '@mui/icons-material';
import '../pages/Dashboard.css';
import './LeftSidebar.css';

const LeftSidebar = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (page) => {
    navigate(`/dashboard/${page.toLowerCase()}`);
  };

  return (
    <div className="left-menu">
      <h4>Menu</h4>
      <ul>
        <li onClick={() => handleMenuItemClick('Home')}><Home /> SLD</li>
        <li onClick={() => handleMenuItemClick('PCS')}><Settings /> PCS</li>
        <li onClick={() => handleMenuItemClick('BESS')}><DataUsage /> BESS</li>
        <li onClick={() => handleMenuItemClick('Network')}><TrendingUp /> Network</li>
        <li onClick={() => handleMenuItemClick('Analytics')}><TrendingUp /> Analytics</li>
        <li onClick={() => handleMenuItemClick('Reports')}><Report /> Reports</li>
        <li onClick={() => handleMenuItemClick('Alarms')}><Alarm /> Alarms/Events</li>
        <li onClick={() => handleMenuItemClick('Modbus')}><Settings /> Modbus Configuration</li>
        <li onClick={() => handleMenuItemClick('UserManagement')}><Settings /> User Management</li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
