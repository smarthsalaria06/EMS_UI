import React, { useEffect, useState } from 'react'; 
import {
  Box, Typography, Checkbox, Button, MenuItem, Select, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { saveAs } from 'file-saver';

const Alarms = () => {
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [ackFilter, setAckFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const alarmsPerPage = 5;

  // Dialog and Snackbar States
  const [selectedAckId, setSelectedAckId] = useState(null);
  const [selectedDelId, setSelectedDelId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetch('/dummy.json')
      .then(res => res.json())
      .then(data => {
        const sorted = (data.alarms || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAlarms(sorted);
        setFilteredAlarms(sorted);
      });
  }, []);

  useEffect(() => {
    let filtered = [...alarms];

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(a => a.priority === priorityFilter);
    }
    if (ackFilter !== 'all') {
      filtered = filtered.filter(a => a.acknowledged === (ackFilter === 'acknowledged'));
    }
    if (search) {
      filtered = filtered.filter(a => a.message.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredAlarms(filtered);
    setCurrentPage(1);
  }, [search, priorityFilter, ackFilter, alarms]);

  // Handle Acknowledge
  const handleAcknowledge = (id) => {
    setSelectedAckId(id); // Triggers the dialog to open
  };

  const confirmAcknowledge = () => {
    const updated = alarms.map(alarm =>
      alarm.id === selectedAckId
        ? { ...alarm, acknowledged: true, timestamp: new Date().toISOString() }
        : alarm
    );
    setAlarms(updated);
    setSelectedAckId(null);
    setSnackbarMessage('Alarm acknowledged');
    setSnackbarOpen(true);
  };

  const cancelAcknowledge = () => {
    setSelectedAckId(null);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setSelectedDelId(id); // Triggers the dialog to open
  };

  const confirmDelete = () => {
    const updated = alarms.filter(alarm => alarm.id !== selectedDelId);
    setAlarms(updated);
    setSelectedDelId(null);
    setSnackbarMessage('Alarm deleted');
    setSnackbarOpen(true);
  };

  const cancelDelete = () => {
    setSelectedDelId(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Message,Priority,Acknowledged,Timestamp\n';
    const rows = filteredAlarms.map(a =>
      `${a.id},"${a.message}",${a.priority},${a.acknowledged},${a.timestamp}` 
    ).join('\n');
    const csv = headers + rows;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'alarms.csv');
  };

  // Pagination Logic
  const indexOfLastAlarm = currentPage * alarmsPerPage;
  const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
  const currentAlarms = filteredAlarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Alarms</Typography>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Search Alarms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <MenuItem value="all">All Priorities</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
        <Select value={ackFilter} onChange={(e) => setAckFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="acknowledged">Acknowledged</MenuItem>
          <MenuItem value="unacknowledged">Unacknowledged</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleExportCSV}>Export to CSV</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ack</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAlarms.map(alarm => (
              <TableRow key={alarm.id} style={{
                borderLeft: `6px solid ${
                  alarm.priority === 'high'
                    ? 'red'
                    : alarm.priority === 'medium'
                    ? 'orange'
                    : 'green'
                }`,
                animation: !alarm.acknowledged ? 'blinker 1s linear infinite' : 'none'
              }}>
                <TableCell>
                  <Checkbox checked={alarm.acknowledged} disabled />
                </TableCell>
                <TableCell>{alarm.message}</TableCell>
                <TableCell>{alarm.priority}</TableCell>
                <TableCell>{new Date(alarm.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  {!alarm.acknowledged && (
                    <Button size="small" onClick={() => handleAcknowledge(alarm.id)}>Acknowledge</Button>
                  )}
                  <Button size="small" color="error" onClick={() => handleDelete(alarm.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredAlarms.length / alarmsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      </Box>

      {/* Blinker animation */}
      <style>
        {`
          @keyframes blinker {
            50% { opacity: 0.4; }
          }
        `}
      </style>

      {/* Dialogs */}
      <Dialog open={!!selectedAckId} onClose={cancelAcknowledge}>
        <DialogTitle>Confirm Acknowledge</DialogTitle>
        <DialogContent>
          Are you sure you want to acknowledge this alarm?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAcknowledge}>Cancel</Button>
          <Button onClick={confirmAcknowledge} variant="contained" color="primary">
            Yes, Acknowledge
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedDelId} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this alarm?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Alarms;
