import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AboutPage from './AboutPage';
import { useAuth } from '../context/AuthContext'; // ✅ directly use AuthContext
import './UserMenu.css';

const UserMenu = ({ anchorEl, open, onClose, user }) => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const { theme, toggleTheme, logout } = useAuth(); // ✅ Get logout directly from useAuth

  const handleAboutOpen = () => {
    setAboutOpen(true);
    onClose();
  };

  const handleAboutClose = () => setAboutOpen(false);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        className="user-menu"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{
          className: 'menu-animation'
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">{user?.email || 'user@email.com'}</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {theme === 'light' ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleAboutOpen}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">About</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>

      <AboutPage open={aboutOpen} onClose={handleAboutClose} />
    </>
  );
};

export default UserMenu;
