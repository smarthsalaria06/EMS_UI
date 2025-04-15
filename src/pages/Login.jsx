import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import CompanyLogo from '../assets/company-logo.png'; // Add your company logo image here
import CompanyBackground from '../assets/company-background.png'; // Add your company background image here

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(''); // To handle login errors

  const handleLogin = () => {
    // Fetch user data from the mock API (json-server)
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => {
        // Check if the user credentials match any user in the mock API
        const user = data.find(
          (user) => user.username === username && user.password === password
        );
        if (user) {
          login(user); // If credentials are correct, log in the user
          navigate('/dashboard'); // Redirect to dashboard page
        } else {
          setError('Invalid credentials'); // Show error if credentials don't match
        }
      })
      .catch((err) => {
        console.error('Error logging in:', err);
        setError('Something went wrong. Please try again later.');
      });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="login-background" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7f56d9, #4c79f3)', // Gradient background
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${CompanyBackground})`, // Company background image
      backgroundSize: 'cover',
      backgroundPosition: 'left center',
    }}>
      <Container component="main" maxWidth="xs" sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '5%',
      }}>
        <Paper elevation={15} sx={{
          padding: 4,
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background for login box
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          marginTop: 0,
          position: 'relative',
          zIndex: 2,
          width: '350px', // Adjust width for the login box
          animation: 'fadeIn 1s ease-out', // Add fade-in animation
        }}>
          <Box textAlign="center" mb={2}>
            <img src={CompanyLogo} alt="Company Logo" style={{ width: '150px', marginBottom: '20px' }} />
            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              Energy Management System
            </Typography>
          </Box>

          {/* Username Field */}
          <TextField
            variant="outlined"
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for input fields
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4c79f3', // Blue border on hover
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -6px) scale(0.75)', // Move label above field when typing
                transition: 'transform 0.2s ease-out', // Smooth transition
              },
            }}
            InputProps={{
              startAdornment: (
                <AccountCircle sx={{ color: '#4c79f3' }} />
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            variant="outlined"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4c79f3',
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -6px) scale(0.75)', // Move label above field when typing
                transition: 'transform 0.2s ease-out', // Smooth transition
              },
            }}
            InputProps={{
              startAdornment: (
                <Lock sx={{ color: '#4c79f3' }} />
              ),
              endAdornment: (
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ color: '#4c79f3' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 2,
              padding: '10px 0',
              borderRadius: 25,
              backgroundColor: '#4c79f3',
              '&:hover': {
                backgroundColor: '#1E90FF', // Lighter blue on hover
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* Error Message */}
          {error && <Typography color="error" align="center" mt={2}>{error}</Typography>}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
