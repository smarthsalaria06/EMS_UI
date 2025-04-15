import React from 'react';

// Import individual page components
import Home from './Home';
import PCS from './PCS';
import BESS from './BESS';
import Network from './Network';
import Analytics from './Analytics';
import Reports from './Reports';
import Alarms from './Alarms';
import Modbus from './Modbus';
import UserManagement from './UserManagement';

const PageContent = ({ currentPage }) => {
  switch (currentPage) {
    case 'Home':
      return <Home />;
    case 'PCS':
      return <PCS />;
    case 'BESS':
      return <BESS />;
    case 'Network':
      return <Network />;
    case 'Analytics':
      return <Analytics />;
    case 'Reports':
      return <Reports />;
    case 'Alarms':
      return <Alarms />;
    case 'Modbus':
      return <Modbus />;
    case 'UserManagement':
      return <UserManagement />;
    default:
      return <div>Select a menu option to view content</div>;
  }
};

export default PageContent;
