import { isMobile } from 'react-device-detect';
import Dashboard from '../pages/Dashboard';
import MobileDashboard from '../pages/MobileDashboard';

const DashboardWrapper = () => {
  return isMobile ? <MobileDashboard /> : <Dashboard />;
};
export default DashboardWrapper;
