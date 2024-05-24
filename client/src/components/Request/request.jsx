import React, { useEffect } from 'react';
import DashboardHeader from '../Dashboard/dashboardheader';

const Request = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-page');
    
        return () => {
          document.body.classList.remove('dashboard-page');
        };
      }, []);
  return (
  <div>
    <DashboardHeader /> 
      
  </div>
  );
};

export default Request;

