// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Safely parse stored user data
  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('user'));
    } catch (err) {
      console.error("Error parsing stored user data:", err);
      return null;
    }
  })();

  const storedToken = sessionStorage.getItem('authToken');
  const storedTheme = sessionStorage.getItem('theme') || 'light';

  // States to manage user, token, and theme
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [themeMode, setThemeMode] = useState(storedTheme);

  // Function to log in (set user and token)
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  // Function to log out (clear user and token)
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear(); // Clears all session data
  };

  // Sync theme mode to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('theme', themeMode);
  }, [themeMode]);

  // Sync user to sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  // Sync token to sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [token]);

  // MUI theme setup based on current theme mode (light or dark)
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

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      theme: themeMode,
      toggleTheme,
    }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
