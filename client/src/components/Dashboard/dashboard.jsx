// Dashboard.js

import React, { useEffect } from 'react';
import DashboardHeader from './dashboardheader';
import './dashboard.css';

const Dashboard = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader /> 
      <div> Other content</div>
    </div>
  );
};

export default Dashboard;








