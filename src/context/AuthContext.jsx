import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('user'));
    } catch (err) {
      return null;
    }
  })();
  const storedToken = sessionStorage.getItem('authToken');
  const storedTheme = sessionStorage.getItem('theme') || 'light';

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [themeMode, setThemeMode] = useState(storedTheme);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authToken', authToken);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const renewSession = () => {}; // No-op if called from old components

  useEffect(() => {
    sessionStorage.setItem('theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [token]);

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        background: {
          default: themeMode === 'light' ? '#f5f5f5' : '#121212',
          paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
      typography: {
        fontFamily: 'Roboto, sans-serif',
      },
    });
  }, [themeMode]);

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
      renewSession,
      theme: themeMode,
      toggleTheme,
      setUser,
    }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
