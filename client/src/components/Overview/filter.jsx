import React from 'react';


const Filter = () => {
  return (
    <div className='app'>
      <div className='container'>
        <h1>Stock Overview</h1>
        <form>
          <div className='input-group'>
            <input type='text' placeholder='Enter Material Code' className='form-control' />
          </div>
        </form>
        <form>
          <div className='input-group'>
            <input type='text' placeholder='Enter Material Short Text' className='form-control' />
          </div>
        </form>
        <form>
          <div className='input-group'>
            <input type='text' placeholder='Enter Plant Code' className='form-control' />
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <th>Material Code</th>
              <th>Plant Code</th>
              <th>Plant Name</th>
              <th>Material Short Text</th>
              <th>Stock Quantity</th>
              <th>Unit of Measurement</th>
              <th>Store No.</th>
              <th>Rank No.</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Filter;
