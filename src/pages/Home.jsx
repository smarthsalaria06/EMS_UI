import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Home = () => {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activePowerTrend, setActivePowerTrend] = useState([]);
  const [reactivePowerTrend, setReactivePowerTrend] = useState([]);
  const [socTrend, setSocTrend] = useState([]);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('../dummy.json');
        const json = await res.json();
        setLogs(json.alarms);
        setTimeline(json.metricsTimeline);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineIndex((prev) => {
        const nextIndex = (prev + 1) % timeline.length;
        const latest = timeline[nextIndex];

        setData({
          totalEnergy: '380 MWh',
          currentSOC: latest.soc,
          status: latest.operationMode,
          powerFlow: `${latest.activePower} kW`,
          voltage: `${latest.voltage} V`,
          frequency: `${latest.frequency} Hz`
        });

        setSocTrend((prevData) => [...prevData.slice(-9), { time: `T${nextIndex + 1}`, soc: latest.soc }]);
        setActivePowerTrend((prevData) => [...prevData.slice(-9), { time: `T${nextIndex + 1}`, value: latest.activePower }]);
        setReactivePowerTrend((prevData) => [...prevData.slice(-9), { time: `T${nextIndex + 1}`, value: latest.reactivePower }]);

        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [timeline]);

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        EMS Dashboard
      </Typography>

      <Grid container spacing={9}>
        {[
          { title: 'Total Energy Discharged', value: data.totalEnergy, icon: <TrendingUpIcon color="primary" /> },
          { title: 'Current SOC', value: `${data.currentSOC}%`, icon: <BatteryChargingFullIcon color="success" /> },
          { title: 'Power Flow', value: data.powerFlow, icon: <FlashOnIcon color="warning" /> },
          { title: 'EMS Status', value: data.status, icon: <PowerSettingsNewIcon color="error" /> },
          { title: 'Grid Voltage', value: data.voltage },
          { title: 'Grid Frequency', value: data.frequency }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  {item.value} {item.icon || null}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      <Grid container spacing={6} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Active Power Trend
              </Typography>
              <ResponsiveContainer width={320} height={200}>
                <LineChart data={activePowerTrend}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Reactive Power Trend
              </Typography>
              <ResponsiveContainer width={320} height={200}>
                <LineChart data={reactivePowerTrend}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#43a047" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                SOC Trend
              </Typography>
              <ResponsiveContainer width={320} height={200}>
                <LineChart data={socTrend}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="soc" stroke="#f57c00" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Recent Logs / Notifications <NotificationsActiveIcon fontSize="small" />
              </Typography>
              {logs.map((log, index) => (
                <Typography key={index} variant="body2" style={{ marginBottom: '5px' }}>
                  • {new Date(log.timestamp).toLocaleString()} – {log.message}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
