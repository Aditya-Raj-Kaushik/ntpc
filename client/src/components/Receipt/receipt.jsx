import React, { useEffect } from 'react';
import DashboardHeader from '../Dashboard/dashboardheader';
import PurchaseOrderForm from './PurchaseOrderForm';

const Receipt = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-page');
    
        return () => {
          document.body.classList.remove('dashboard-page');
        };
      }, []);

  return (
    <div>
    <DashboardHeader /> 
    <PurchaseOrderForm/>
    </div>
  );
};

export default Receipt;
