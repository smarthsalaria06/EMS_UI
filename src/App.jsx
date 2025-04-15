// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Alarms from './pages/Alarms';
import Analytics from './pages/Analytics';
import BESS from './pages/BESS';
import Modbus from './pages/Modbus';
import Network from './pages/Network';
import PCS from './pages/PCS';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';

const AppContent = () => {
  const { theme } = useAuth();
  const location = useLocation();

  // Apply dark-theme class for custom global styles (optional)
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  

  const isLoginPage = location.pathname === '/';

  return (
    <>
      <CssBaseline />
   {/* Show theme toggle on all pages except login */}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
         
              <Dashboard />
  
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="pcs" element={<PCS />} />
          <Route path="bess" element={<BESS />} />
          <Route path="network" element={<Network />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="modbus" element={<Modbus />} />
          <Route path="usermanagement" element={<UserManagement />} />
        </Route>
        <Route path="/dashboard/user-management" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
