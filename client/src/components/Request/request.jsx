import React, { useEffect } from 'react';
import Form from './form';
import DashboardHeader from '../Dashboard/dashboardheader';
import './request.css'

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
      <Form />
    </div>
  );
};

export default Request;
