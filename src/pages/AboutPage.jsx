// src/pages/AboutPage.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './AboutPage.css';

const AboutPage = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="about-dialog"
      PaperProps={{ className: 'about-dialog-paper' }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">About</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          © 2025 PREMIER ENERGIES STORAGE SOLUTIONS PVT. LTD.
        </Typography>
        <Typography variant="body1" gutterBottom>
          ENERGY MANAGEMENT SYSTEM
        </Typography>
        <Typography variant="body2" color="text.secondary">
          UI Version: 0.0.1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Core Software Version: 0.0.1
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default AboutPage;
