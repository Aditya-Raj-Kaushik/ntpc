import React, { useState } from 'react';
import "./dashboard.css";

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header">
      <button className="hamburger" onClick={toggleMenu}>
        &#9776;
      </button>
      <ul className={`navbar ${isOpen ? 'open' : ''}`}>
        <li><a href="/Dashboard">Dashboard</a></li>
        <li><a href="/Overview">Overview</a></li>
        <li><a href="/Issue">Issue</a></li>
        <li><a href="/Receipt">Receipt</a></li>
        <li><a href="/Transaction">Transaction</a></li>
        <li><a href="/">Log Out</a></li>
      </ul>
    </div>
  );
};

export default DashboardHeader;
