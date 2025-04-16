import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Alarm,
  Report,
  People,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  BarChart as AnalyticsIcon,
  FlashOn as PcsIcon,
  BatteryChargingFull as BessIcon,
  SettingsInputComponent as ModbusIcon,
  DeviceHub as NetworkIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import './LeftSidebar.css';

const LeftSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', icon: <DashboardIcon />, path: 'home' },
    { label: 'SLD', icon: <Home />, path: 'sld' },
    { label: 'PCS', icon: <PcsIcon />, path: 'pcs' },
    { label: 'BESS', icon: <BessIcon />, path: 'bess' },
    { label: 'Network', icon: <NetworkIcon />, path: 'network' },
    { label: 'Analytics', icon: <AnalyticsIcon />, path: 'analytics' },
    { label: 'Reports', icon: <ReportsIcon />, path: 'reports' },
    { label: 'Alarms/Events', icon: <Alarm />, path: 'alarms' },
    { label: 'Modbus Config', icon: <ModbusIcon />, path: 'modbus' },
    { label: 'User Management', icon: <People />, path: 'usermanagement' },
  ];

  const handleMenuItemClick = (page) => {
    navigate(`/dashboard/${page}`);
  };

  return (
    <div className="left-menu">
      <h4 className="menu-header">Menu</h4>
      <ul>
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={window.location.pathname.includes(item.path) ? 'active' : ''}
            onClick={() => handleMenuItemClick(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
