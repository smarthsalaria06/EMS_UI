import React, { useRef, useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { bess_layout, cont_layout } from '../templates/BESS-template';

const BESS = () => {
  const gridParentRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(1200);

  useEffect(() => {
    function updateWidth() {
      if (gridParentRef.current) {
        setGridWidth(gridParentRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div>
      <h3>BESS Page</h3>
      {/* Scrollable container for cont_layout cards */}
      <div
        style={{
          border: '2px solid #3b3b3bff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          background: '#e3f2fd',
          width: '100%',
          maxWidth: 1200,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxHeight: 400,
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            minWidth: 900,
          }}
        >
          {cont_layout.map((item) => (
            <div
              key={item.i}
              style={{
                minHeight: 150,
                minWidth: 200,
                border: '1px solid #ccc',
                borderRadius: 8,
                background: '#fff',
                padding: 12,
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <strong>{item.i}</strong>
              <div style={{ fontSize: 12, color: '#888' }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive GridLayout */}
      <div ref={gridParentRef} style={{ 
          width: '100%',
          maxWidth: 1300,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxHeight: 400,
          overflowX: 'auto',
          overflowY: 'auto' }}>
        <GridLayout
          className="layout"
          layout={bess_layout}
          cols={6}
          rowHeight={60}
          width={gridWidth}
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
    </div>
  );
};

export default BESS;