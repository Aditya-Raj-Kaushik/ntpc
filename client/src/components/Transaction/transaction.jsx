import React, { useEffect } from 'react';

const Transaction = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-page');
    
        return () => {
          document.body.classList.remove('dashboard-page');
        };
      }, []);
  return (

      <h1>Transaction History</h1>
  );
};

export default Transaction;

