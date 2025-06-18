import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const LiveMetricsMobile = () => {
  const [metrics, setMetrics] = useState([]);
  const [alarms, setAlarms] = useState([]);

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
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Live Metrics
      </Typography>

      <Grid container spacing={4}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{metric.operationMode}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" align="center">Active Power</Typography>
                    <CircularProgressbar
                      value={metric.activePower}
                      maxValue={metric.maxActivePower}
                      text={`${metric.activePower} kW`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" align="center">Voltage</Typography>
                    <CircularProgressbar
                      value={metric.voltage}
                      maxValue={500}
                      text={`${metric.voltage} V`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" align="center">Capacity</Typography>
                    <CircularProgressbar
                      value={metric.capacity}
                      maxValue={1000}
                      text={`${metric.capacity} kWh`}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" align="center" sx={{ marginTop: 6 }} gutterBottom>
        Alarms
      </Typography>

      <Grid container spacing={3}>
        {alarms.map((alarm, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body1">{alarm.message}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: {alarm.priority} | Acknowledged: {alarm.acknowledged ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Timestamp: {new Date(alarm.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LiveMetricsMobile;
