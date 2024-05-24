import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './overview.css';

const Filter = () => {
  const [filters, setFilters] = useState({
    MaterialCode: '',
    MaterialShortText: '',
    PlantCode: ''
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7001/Overview')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only numeric input for PlantCode
    if (name === 'PlantCode' && value !== '' && !/^\d*$/.test(value)) {
      return;
    }
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredData = data.filter(item => {
    return (
      (filters.MaterialCode === '' || item.MaterialCode.toLowerCase().includes(filters.MaterialCode.toLowerCase())) &&
      (filters.MaterialShortText === '' || item.MaterialShortText.toLowerCase().includes(filters.MaterialShortText.toLowerCase())) &&
      (filters.PlantCode === '' || item.PlantCode.toString() === filters.PlantCode)
    );
  });

  return (
    <div className='app'>
      <div className='container'>
        <h1>Stock Overview</h1>
        <form>
          <div className='input-group'>
            <input
              name='MaterialCode'
              type='text'
              placeholder='Enter Material Code'
              className='form-control'
              onChange={handleInputChange}
            />
          </div>
        </form>
        <form>
          <div className='input-group'>
            <input
              name='MaterialShortText'
              type='text'
              placeholder='Enter Material Short Text'
              className='form-control'
              onChange={handleInputChange}
            />
          </div>
        </form>
        <form>
          <div className='input-group'>
            <input
              name='PlantCode'
              type='text'
              placeholder='Enter Plant Code'
              className='form-control'
              onChange={handleInputChange}
            />
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
              <th>Rack No.</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.MaterialCode}</td>
                <td>{item.PlantCode}</td>
                <td>{item.PlantName}</td>
                <td>{item.MaterialShortText}</td>
                <td>{item.StockQuantity}</td>
                <td>{item.UOM}</td>
                <td>{item.StoreNo}</td>
                <td>{item.RackNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Filter;
