import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Use AuthContext hook
import './SessionExpirePopup.css';  // Import external CSS for styling

const SessionExpirePopup = () => {
  const { sessionExpired, showPopup, renewSession, logout, RENEW_GRACE_PERIOD, SESSION_TIMEOUT } = useAuth();
  
  // States for timers
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_TIMEOUT / 1000); // Session timer (in seconds)
  const [popupTimeLeft, setPopupTimeLeft] = useState(RENEW_GRACE_PERIOD / 1000); // Popup timer (in seconds)
  
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [popupIntervalId, setPopupIntervalId] = useState(null);

  // Session timeout effect
  useEffect(() => {
    if (!sessionExpired) return;

    // Reset timers when session expires
    setSessionTimeLeft(SESSION_TIMEOUT / 1000);
    setPopupTimeLeft(RENEW_GRACE_PERIOD / 1000);
    setIsLoggedOut(false);

    // Start the session timeout timer
    const sessionTimerId = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(sessionTimerId); // Stop the session timer
          logout(); // Log out the user
          setIsLoggedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start the popup countdown timer when session expires
    const popupTimerId = setInterval(() => {
      setPopupTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(popupTimerId); // Stop popup timer
          setIsLoggedOut(true); // Log out the user after popup timer expires
          logout(); // Log out after inactivity
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(sessionTimerId);
    setPopupIntervalId(popupTimerId);

    // Cleanup both intervals on unmount
    return () => {
      clearInterval(sessionTimerId);
      clearInterval(popupTimerId);
    };
  }, [sessionExpired, logout]);

  // Handler for renewing the session
  const handleRenewSession = () => {
    renewSession(); // Renew the session
    clearInterval(popupIntervalId); // Stop the popup countdown timer
    setPopupTimeLeft(RENEW_GRACE_PERIOD / 1000); // Reset the popup timer
    setIsLoggedOut(false); // Reset logged-out status
  };

  // Handler for logging out immediately
  const handleLogout = () => {
    logout(); // Immediately log out
    clearInterval(sessionIntervalId); // Stop the session timer
    clearInterval(popupIntervalId); // Stop the popup timer
    setSessionTimeLeft(0); // Reset session countdown immediately
    setPopupTimeLeft(0); // Reset popup countdown immediately
    setIsLoggedOut(true); // Mark as logged out immediately
  };

  // If the popup is not supposed to show, return null
  if (!showPopup) return null;

  return (
    <div className="session-popup-overlay">
      <div className="session-popup">
        <h3 className="popup-header">⚠️ Session Expired</h3>

        {!isLoggedOut ? (
          <>
            <p className="popup-text">
              Your session will expire in <strong>{sessionTimeLeft}</strong> seconds.
            </p>
            <p className="popup-text">
              You have <strong>{popupTimeLeft}</strong> seconds to renew your session or log out.
            </p>

            <div className="popup-buttons">
              <button className="btn renew" onClick={handleRenewSession}>
                Renew Session
              </button>
              <button className="btn logout" onClick={handleLogout}>
                Logout Now
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className="popup-text">You have been logged out due to inactivity.</p>
            <button className="btn ok" onClick={() => window.location.href = '/login'}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionExpirePopup;
