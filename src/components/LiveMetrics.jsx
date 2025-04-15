import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../pages/Dashboard.css';

const LiveMetrics = ({ theme }) => {
  const [metrics, setMetrics] = useState([]);
  const [alarms, setAlarms] = useState([]);

  // Debugging: Check if theme is passed correctly
  useEffect(() => {
    console.log("Current Theme:", theme);
  }, [theme]);

  // Set dynamic background and text colors based on the current theme
  const pageBgColor = theme === 'dark' ? '#121212' : '#fafafa'; // Page background color
  const textColor = theme === 'dark' ? '#ffffff' : '#000000'; // Text color
  const cardBgColor = theme === 'dark' ? '#2e2e2e' : '#ffffff'; // Metric card background
  const headerBgColor = theme === 'dark' ? '#424242' : '#f5f5f5'; // Header background color
  const alarmTextColor = theme === 'dark' ? '#e0e0e0' : '#333333'; // Alarm text color

  useEffect(() => {
    let timeline = [];
    let index = 0;

    fetch('/dummy.json')
      .then((res) => res.json())
      .then((data) => {
        timeline = data.metricsTimeline || [];
        setAlarms(data.alarms || []);

        if (timeline.length > 0) {
          setMetrics(timeline[0]);
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
    <div style={{ color: textColor, height: 'auto' }}>
      <Typography variant="h5" gutterBottom style={{ color: textColor }}>Live Metrics</Typography>

      {/* Operation Mode */}
      <Box
        className="metric-card operation-mode"
        style={{ backgroundColor: cardBgColor }}
      >
        <Typography variant="body2" style={{ color: textColor }}>Operation Mode</Typography>
        <Typography variant="h6" style={{ color: textColor }}>{metrics.operationMode || 'N/A'}</Typography>
      </Box>

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

      {/* Active Alarms */}
      <div className="alarm-list">
        <Typography variant="h5" style={{ color: textColor }}>Active Alarms</Typography>
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
