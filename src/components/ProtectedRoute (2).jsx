// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Assuming user is stored in AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a user stored in AuthContext or sessionStorage
    const userSessionData = sessionStorage.getItem('user');
    if (user || userSessionData) {
      setIsAuthenticated(true); // The user is authenticated
    } else {
      setIsAuthenticated(false); // No user found, redirect to login
    }
  }, [user]); // Re-run effect when user in AuthContext changes

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render protected route content if authenticated
};

export default ProtectedRoute;
