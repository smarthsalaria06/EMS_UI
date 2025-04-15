import React, { useState, useEffect } from 'react';
import { Switch } from '@mui/material';

const ThemeToggle = ({ onThemeChange }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      onThemeChange(storedTheme); // Notify parent about the theme change
    }
  }, [onThemeChange]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    onThemeChange(newTheme); // Notify parent about the theme change
  };

  return (
    <div className="theme-toggle">
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        color="default"
        inputProps={{ 'aria-label': 'theme toggle' }}
      />
      <span>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
    </div>
  );
};

export default ThemeToggle;
