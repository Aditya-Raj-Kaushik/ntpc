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
      
      <br />
      <ul>
        <li><a href="/Overview">Overview</a></li>      
        <li><a href="/Receipt">Receipt & Issue</a></li>
        <li><a href="/Transaction">Transaction</a></li>
        <li><a href="/">Log Out</a></li>
      </ul>
      
    </div>
  );
};

export default Dashboard;
