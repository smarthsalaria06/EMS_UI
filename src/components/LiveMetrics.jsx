import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Divider, Modal } from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import 'react-circular-progressbar/dist/styles.css';
import './LiveMetrics.css';
import OperationMode from './OperationMode';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

const LiveMetrics = ({ theme }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();
  const defaultLayout = [
    'activePower', 'reactivePower', 'powerFactor',
    'voltage', 'frequency', 'capacity',
    'soc', 'soh'
  ];

  const [metrics, setMetrics] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('liveMetricsLayout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  useEffect(() => {
    let timeline = [];
    let index = 0;
    let intervalId;

    fetch('/dummy.json')
      .then((res) => res.json())
      .then((data) => {
        timeline = data.metricsTimeline || [];
        setAlarms(data.alarms || []);
        if (timeline.length > 0) setMetrics(timeline[0]);

        intervalId = setInterval(() => {
          if (timeline.length > 0) {
            setMetrics(timeline[index]);
            index = (index + 1) % timeline.length;
          }
        }, 5000);
      });

    return () => clearInterval(intervalId);
  }, []);

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;

    const newLayout = Array.from(layout);
    const [movedItem] = newLayout.splice(source.index, 1);
    newLayout.splice(destination.index, 0, movedItem);

    setLayout(newLayout);
    localStorage.setItem('liveMetricsLayout', JSON.stringify(newLayout));
  };

  // Function to return dot color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';  // High priority - red
      case 'medium':
        return 'orange';  // Medium priority - orange
      case 'low':
        return 'green';  // Low priority - green
      default:
        return 'gray';  // Default color if priority is undefined
    }
  };
  const handleAlarmClick = () => {
    navigate('/dashboard/alarms');
  };

  const metricValueMap = useMemo(() => ({
    activePower: { label: 'Active Power (P)', value: Math.abs(metrics.activePower || 0), max: Math.abs(metrics.maxActivePower || 100), unit: 'kW' },
    reactivePower: { label: 'Reactive Power (Q)', value: Math.abs(metrics.reactivePower || 0), max: Math.abs(metrics.maxReactivePower || 100), unit: 'kVAR' },
    powerFactor: { label: 'Power Factor', textOnly: metrics.powerFactor || 'N/A' },
    voltage: { label: 'Voltage (V)', textOnly: `${metrics.voltage || 'N/A'} V` },
    frequency: { label: 'Frequency (Hz)', textOnly: `${metrics.frequency || 'N/A'} Hz` },
    capacity: { label: 'Overall Capacity', textOnly: `${metrics.capacity || 'N/A'} kWh` },
    soc: { label: 'State of Charge (SOC)', value: metrics.soc || 0, max: 100, unit: '%' },
    soh: { label: 'State of Health (SOH)', value: metrics.soh || 0, max: 100, unit: '%' },
  }), [metrics]);
  

  const renderCard = (type) => {
    const card = metricValueMap[type];
    if (!card) return null;

    return (
      <Box className="metric-card">
        <Typography variant="body2">{card.label}</Typography>
        {card.textOnly ? (
          <Typography variant="h6">{card.textOnly}</Typography>
        ) : (
          <CircularProgressbar
            value={card.value}
            maxValue={card.max}
            text={`${card.value} ${card.unit}`}
            strokeWidth={8}
            className={metrics[type] < 0 ? 'negative-gauge' : 'positive-gauge'}
          />
        )}
      </Box>
    );
  };

  return (
    <div className={`live-metrics-container ${theme}`}>
      <Typography variant="h5" gutterBottom className="title">Live Metrics</Typography>

      {/* Fixed Operation Mode Card */}
      <Box onClick={() => setOpenModal(true)} className="operation-mode-card locked">
        <Typography variant="body1" className="operation-mode-text">Operation Mode</Typography>
        <Typography variant="h6" className="operation-mode-value">{metrics.operationMode || 'N/A'}</Typography>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="operation-mode-modal">
          <div className="operation-mode-modal-content">
            <Typography className="operation-mode-modal-header">Operation Mode Details</Typography>
            <div className="operation-mode-modal-body">
              <OperationMode />
            </div>
            <div className="operation-mode-modal-actions">
              <button className="operation-mode-button" onClick={() => setOpenModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Metric Cards Section */}
      <div className="metrics-section">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="singleContainer" direction="vertical" type="grid">
            {(provided) => (
              <div
                className="metrics-row"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {layout.map((metricType, index) => (
                  <Draggable
                    key={metricType}
                    draggableId={metricType}
                    index={index}
                    isDragDisabled={metricType === 'operationMode'}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`draggable-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        {renderCard(metricType)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Alarm Section */}
      <Typography variant="h5" gutterBottom className="title">Active Alarms</Typography>
      <div className="alarm-list scrollable">
        {alarms.length === 0 ? (
          <Typography variant="body2">No active alarms</Typography>
        ) : (
          alarms.map((alarm, idx) => (
            <Box
              key={idx}
              className="alarm-item"
              onClick={handleAlarmClick}
              sx={{ cursor: 'pointer' }}
            >
              <span
                className={`alarm-dot ${alarm.priority}`}
                style={{ backgroundColor: getPriorityColor(alarm.priority) }}
              />
              <Typography variant="body2">{alarm.message}</Typography>
            </Box>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveMetrics;
