// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedTheme = localStorage.getItem('theme') || 'light';

  const [user, setUser] = useState(storedUser);
  const [themeMode, setThemeMode] = useState(storedTheme);

  // Toggle theme mode between 'light' and 'dark'
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
  };

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  // Save user info
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // MUI dynamic theme object
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === 'light'
        ? {
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  }), [themeMode]);

  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null), theme: themeMode, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
