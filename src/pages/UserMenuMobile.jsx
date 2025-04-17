import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // More options icon for the menu

const UserMenuMobile = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the menu visibility

  // Open menu handler
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu handler
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="user-menu-mobile">
      {/* Button to open the menu */}
      <IconButton onClick={handleClick} color="primary">
        <Avatar>
          {/* Add user initials or image if needed */}
          U
        </Avatar>
      </IconButton>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Menu Items */}
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Notifications</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Log Out</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenuMobile;
