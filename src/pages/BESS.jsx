import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import  {bess_layout,cont_layout} from '../templates/BESS-template';
const layout = [
  { i: 'Voltage', x: 0, y: 0, w: 2, h: 2 },
  { i: 'Current', x: 2, y: 0, w: 2, h: 2 },
  { i: 'Power', x: 4, y: 0, w: 2, h: 2 }
];
 
const BESS = () => {
  return (
    <div>
      <h3>BESS Page</h3>
      {/* Scrollable container for cont_layout cards */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 16,
          padding: '8px 0',
          marginBottom: 24,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        {cont_layout.map((item) => (
          <div
            key={item.i}
            style={{
              minWidth: 120,
              border: '1px solid #ccc',
              borderRadius: 8,
              background: '#fff',
              padding: 12,
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              flex: '0 0 auto',
            }}
          >
            <strong>{item.i}</strong>
            <div style={{ fontSize: 12, color: '#888' }}>
              x:{item.x}, y:{item.y}
            </div>
          </div>
        ))}
      </div>
 
      <GridLayout
        className="layout"
        layout={bess_layout}
        cols={6}
        rowHeight={60}
        width={1100}
        draggableHandle=".draggable-card-header"
      >
        {bess_layout.map((item) => (
          <div
            key={item.i}
            data-grid={item}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              background: '#f9f9f9',
            }}
          >
            <div
              className="draggable-card-header"
              style={{
                cursor: 'move',
                padding: 8,
                background: '#eee',
                borderBottom: '1px solid #ccc',
              }}
            >
              {item.i}
            </div>
            <div style={{ padding: 8 }}>Content for {item.i}</div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
export default BESS;
