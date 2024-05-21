import React, { useEffect } from 'react';

const Overview = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <div>
      <h1>Overview</h1>
    </div>
  );
};

export default Overview;
