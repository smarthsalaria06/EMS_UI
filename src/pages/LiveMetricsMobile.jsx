import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const LiveMetricsMobile = () => {
  const [metrics, setMetrics] = useState([]);
  const [alarms, setAlarms] = useState([]);

  // Fetch the data from dummy.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/path/to/dummy.json'); // Update path if needed
        const data = await response.json();
        
        setMetrics(data.metricsTimeline);
        setAlarms(data.alarms);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="live-metrics-mobile">
      <Typography variant="h5" align="center" gutterBottom>
        Live Metrics
      </Typography>

      <Grid container spacing={3}>
        {/* Loop over metrics and display them */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{metric.operationMode}</Typography>
                <div className="metric-data">
                  <div className="metric-item">
                    <Typography>Active Power</Typography>
                    <CircularProgressbar
                      value={metric.activePower}
                      maxValue={metric.maxActivePower}
                      text={`${metric.activePower} kW`}
                    />
                  </div>

                  <div className="metric-item">
                    <Typography>Voltage</Typography>
                    <CircularProgressbar
                      value={metric.voltage}
                      maxValue={500}
                      text={`${metric.voltage} V`}
                    />
                  </div>

                  <div className="metric-item">
                    <Typography>Capacity</Typography>
                    <CircularProgressbar
                      value={metric.capacity}
                      maxValue={1000}
                      text={`${metric.capacity} kWh`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" align="center" gutterBottom>
        Alarms
      </Typography>

      <Grid container spacing={3}>
        {/* Loop over alarms and display them */}
        {alarms.map((alarm, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body1">{alarm.message}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Priority: {alarm.priority} | Acknowledged: {alarm.acknowledged ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Timestamp: {new Date(alarm.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LiveMetricsMobile;
