import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  IconButton,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import CompanyLogo from '../assets/company-logo.png';
import CompanyBackground from '../assets/company-background.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || 'Invalid credentials');
            });
          }
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          if (data.success) {
            login(data.user, data.token);
            navigate('/dashboard/home');
          } else {
            setError(data.message || 'Login failed');
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || 'Something went wrong. Please try again later.');
        });
    }, 1500);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="login-background"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7f56d9, #4c79f3)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${CompanyBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? '20px' : '0',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="login-container"
      >
        <Paper
          elevation={15}
          sx={{
            padding: isMobile ? 3 : 4,
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '400px',
          }}
          className="login-paper"
        >
          <Box textAlign="center" mb={2}>
            <img
              src={CompanyLogo}
              alt="Company Logo"
              className="login-logo" 
              style={{ width: isMobile ? '120px' : '150px', marginBottom: '10px' }}
            />
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{ fontFamily: 'Roboto, sans-serif' }}
              className="login-title"
            >
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
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4c79f3',
              },
            }}
            InputProps={{
              startAdornment: <AccountCircle sx={{ color: '#4c79f3', mr: 1 }} />,
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
            }}
            InputProps={{
              startAdornment: <Lock sx={{ color: '#4c79f3', mr: 1 }} />,
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
              fontSize: isMobile ? '0.9rem' : '1rem',
              '&:hover': {
                backgroundColor: '#1E90FF',
              },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          {/* Error Message */}
          {error && (
            <Typography color="error" align="center" mt={2} fontSize={isMobile ? '0.85rem' : '1rem'}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
