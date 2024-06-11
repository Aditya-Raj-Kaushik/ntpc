import React, { useState } from 'react';
import { useAuth } from '../authContext'; // Import the AuthContext
import "./dashboard.css";

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Get the user from the AuthContext

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
        {user?.role === 'admin' && (
          <>
            <li><a href="/Issue">Issue</a></li>
            <li><a href="/Receipt">Receipt</a></li>
          </>
        )}
        {user?.role === 'user' && (
          <>
            <li><a href="/Request">Request</a></li>
          </>
        )}
        <li><a href="/">Log Out</a></li>
      </ul>
    </div>
  );
};

export default DashboardHeader;
