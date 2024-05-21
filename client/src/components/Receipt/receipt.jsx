import React, { useEffect } from 'react';

const Receipt = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-page');
    
        return () => {
          document.body.classList.remove('dashboard-page');
        };
      }, []);

  return (

      <h1>Receipt & Issue</h1>

  );
};

export default Receipt;
