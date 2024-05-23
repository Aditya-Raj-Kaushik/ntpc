import React, { useEffect } from 'react';
import DashboardHeader from '../Dashboard/dashboardheader';
import Filter from './filter';


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
      <Filter/>
    </div>
  );
};

export default Overview;
