import React, { useEffect } from 'react';
import "./dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <a href="/">Log Out</a>
    </div>
  );
};

export default Dashboard;
