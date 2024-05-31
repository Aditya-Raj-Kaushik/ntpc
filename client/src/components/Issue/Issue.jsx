import React, { useEffect } from 'react';
import DashboardHeader from '../Dashboard/dashboardheader';
import Action from './action';
import History from './history';

const Issue = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <div>
      <DashboardHeader/>
      <Action/>
      <History/>
    </div>
  );
};

export default Issue;
