import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // ✅ useNavigate hook

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

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [themeMode, setThemeMode] = useState(storedTheme);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MS) || 5000;  // Default to 5 minutes if not set
  const RENEW_GRACE_PERIOD = parseInt(import.meta.env.VITE_RENEW_GRACE_MS) || 5000;
  const countdownInterval = 1000; // 1 second interval for countdown

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authToken', authToken);

    setShowPopup(false);  // Ensure the pop-up is hidden when user logs in
    setTimeRemaining(sessionTimeout);
    setLastActivityTime(Date.now());
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate('/login'); // ✅ use navigate to redirect to login page
    setToken(null);
    setSessionExpired(false);
    setShowPopup(false); // Close the pop-up on logout
  };

  const renewSession = () => {
    setSessionExpired(false);
    setTimeRemaining(sessionTimeout); // Reset to original session timeout value
    setLastActivityTime(Date.now());
    setShowPopup(false); // Close the pop-up after renewing the session
  };

  const resetSessionTimer = () => {
    setLastActivityTime(Date.now());
  };

  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      const remainingTime = sessionTimeout - (Date.now() - lastActivityTime);
      setTimeRemaining(remainingTime);

      if (remainingTime <= RENEW_GRACE_PERIOD && !sessionExpired) {
        setShowPopup(true); // Show session expiration popup
      }

      if (remainingTime <= 0 && !sessionExpired) {
        setSessionExpired(true);
        setShowPopup(true); // Trigger session expiration when time runs out
      }
    }, countdownInterval);

    return () => clearInterval(timer);
  }, [lastActivityTime, sessionExpired, user, sessionTimeout, RENEW_GRACE_PERIOD]);

  useEffect(() => {
    const handleUserActivity = () => resetSessionTimer();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []);

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

  const muiTheme = useMemo(() => createTheme({
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
  }), [themeMode]);

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
      sessionExpired,
      showPopup,
      timeRemaining,
      theme: themeMode,
      toggleTheme,
      RENEW_GRACE_PERIOD,
    
      setUser,
      setSessionExpired,
    }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
