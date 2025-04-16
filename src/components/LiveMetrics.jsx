import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Button, Modal } from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../pages/Dashboard.css';
import OperationMode from './OperationMode'; // ✅ Import your OperationMode component

const LiveMetrics = ({ theme }) => {
  const [metrics, setMetrics] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [openModal, setOpenModal] = useState(false); // ✅ Modal state

  useEffect(() => {
    console.log("Current Theme:", theme);
  }, [theme]);

  const pageBgColor = theme === 'dark' ? '#121212' : '#fafafa';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const cardBgColor = theme === 'dark' ? '#2e2e2e' : '#ffffff';
  const alarmTextColor = theme === 'dark' ? '#e0e0e0' : '#333333';

  useEffect(() => {
    let timeline = [];
    let index = 0;

    fetch('/dummy.json')
      .then((res) => res.json())
      .then((data) => {
        timeline = data.metricsTimeline || [];
        setAlarms(data.alarms || []);  // Save alarms to state

        if (timeline.length > 0) {
          setMetrics(timeline[0]); // Set initial metrics
        }

        const interval = setInterval(() => {
          if (timeline.length > 0) {
            setMetrics(timeline[index]);
            index = (index + 1) % timeline.length;
          }
        }, 2000);

        return () => clearInterval(interval);
      });
  }, []);

  return (
    <div style={{ color: textColor, height: 'auto', alignContent: "center" }}>
      <Typography variant="h5" gutterBottom style={{ color: textColor }}>Live Metrics</Typography>

      {/* ✅ Entire Operation Mode Card as a Button */}
      <Box
        onClick={() => setOpenModal(true)}
        className="metric-card operation-mode"
        style={{
          backgroundColor: cardBgColor,
          cursor: 'pointer',
          transition: '0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          ':hover': {
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }
        }}
      >
        <Typography variant="body2" style={{ color: textColor }}>Operation Mode</Typography>
        <Typography 
          variant="h6" 
          style={{ 
            color: textColor, 
            fontWeight: 'bold',
            marginTop: '4px',
            textTransform: 'uppercase' 
          }}
        >
          {metrics.operationMode || 'N/A'}
        </Typography>
      </Box>

      {/* ✅ Modal for Operation Mode */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="operation-mode-modal"
        aria-describedby="operation-mode-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: theme === 'dark' ? '#2e2e2e' : 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            color: textColor,
          }}
        >
          <Typography variant="h6" id="operation-mode-modal" gutterBottom>
            Operation Mode Details
          </Typography>
          <OperationMode />
        </Box>
      </Modal>

      {/* Power Metrics */}
      <div className="two-column-params">
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Active Power (P)</Typography>
          <CircularProgressbar
            value={Math.abs(metrics.activePower) || 0}
            maxValue={Math.abs(metrics.maxActivePower) || 100}
            text={`${metrics.activePower || 0} kW`}
            strokeWidth={10}
            className={metrics.activePower < 0 ? "negative-gauge" : "positive-gauge"}
          />
        </Box>

        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Reactive Power (Q)</Typography>
          <CircularProgressbar
            value={Math.abs(metrics.reactivePower) || 0}
            maxValue={Math.abs(metrics.maxReactivePower) || 100}
            text={`${metrics.reactivePower || 0} kVAR`}
            strokeWidth={10}
            className={metrics.reactivePower < 0 ? "negative-gauge" : "positive-gauge"}
          />
        </Box>
      </div>

      {/* Other Parameters */}
      <div className="two-column-params">
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Power Factor</Typography>
          <Typography variant="h6" style={{ color: textColor }}>{metrics.powerFactor || 'N/A'}</Typography>
        </Box>
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Voltage (V)</Typography>
          <Typography variant="h6" style={{ color: textColor }}>{metrics.voltage || 'N/A'} V</Typography>
        </Box>
      </div>

      <div className="two-column-params">
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Frequency (Hz)</Typography>
          <Typography variant="h6" style={{ color: textColor }}>{metrics.frequency || 'N/A'} Hz</Typography>
        </Box>
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>Overall Capacity (kWh)</Typography>
          <Typography variant="h6" style={{ color: textColor }}>{metrics.capacity || 'N/A'} kWh</Typography>
        </Box>
      </div>

      {/* Battery State Metrics */}
      <div className="two-column-params">
        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>State of Charge (SOC) (%)</Typography>
          <CircularProgressbar
            value={metrics.soc || 0}
            maxValue={100}
            text={`${metrics.soc || 0}%`}
          />
        </Box>

        <Box className="metric-card" style={{ backgroundColor: cardBgColor }}>
          <Typography variant="body2" style={{ color: textColor }}>State of Health (SOH) (%)</Typography>
          <CircularProgressbar
            value={metrics.soh || 0}
            maxValue={100}
            text={`${metrics.soh || 0}%`}
          />
        </Box>
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Active Alarms with Scrollable Container */}
      <Typography variant="h5" style={{ color: textColor }}>Active Alarms</Typography>
      <div className="alarm-list" style={{ maxHeight: '100px', overflowY: 'auto', paddingRight: '10px' }}>
        {alarms.length === 0 ? (
          <Typography variant="body2" style={{ color: alarmTextColor }}>No active alarms</Typography>
        ) : (
          alarms.map((alarm, idx) => (
            <Box key={idx} className="alarm-item" style={{ color: alarmTextColor }}>
              <span className="alarm-dot" />
              <Typography variant="body2" style={{ color: alarmTextColor }}>{alarm.message}</Typography>
            </Box>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveMetrics;
