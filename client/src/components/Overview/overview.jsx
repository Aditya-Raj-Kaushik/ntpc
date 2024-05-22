import React, { useEffect } from 'react';
import DashboardHeader from '../Dashboard/dashboardheader';

const Overview = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <div>
      <DashboardHeader/>
      <h1>Overview</h1>
    </div>
  );
};

export default Overview;