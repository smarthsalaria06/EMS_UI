import React, { useState } from 'react';
import './SLD.css';

const assetLayout = [
  [
    { name: 'Grid', type: 'source', description: 'External utility grid' },
  ],
  [
    { name: 'POI Meter', type: 'device', description: 'Point of Interconnection meter for voltage, power and frequency' },
  ],
  [
    { name: 'Power Transformer', type: 'device', description: 'Steps down/up voltage between grid and EMS' },
  ],
  [
    { name: 'PLC', type: 'controller', description: 'Handles control signals and feedbacks' },
  ],
  [
    { name: 'EMS Controller', type: 'controller', description: 'Main controller for Energy Management System' },
    { name: 'EMS Controller (Redundant)', type: 'controller', description: 'Backup EMS controller' }
  ],
  [
    { name: 'PCS', type: 'device', description: 'Power Conversion System to charge/discharge BESS' },
    { name: 'BESS', type: 'storage', description: 'Battery Energy Storage System with SOC, SOH, alarms' }
  ],
  [
    { name: 'Firewall', type: 'security', description: 'Security firewall for network protection' },
    { name: 'SLDC', type: 'monitor', description: 'State Load Dispatch Center receiving EMS data' }
  ]
];

const SLD = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  return (
    <div className="sld-container">
      <h2>Single Line Diagram (SLD)</h2>
      <div className="sld-diagram-vertical">
        {assetLayout.map((row, rowIndex) => (
          <div className="sld-row" key={rowIndex}>
            {row.map((asset, colIndex) => (
              <div
                key={colIndex}
                className="sld-asset"
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="sld-box">{asset.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="sld-popup" onClick={() => setSelectedAsset(null)}>
          <div className="sld-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedAsset(null)}>&times;</button>
            <h3>{selectedAsset.name}</h3>
            <p>{selectedAsset.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLD;
