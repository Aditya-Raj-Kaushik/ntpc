import React, { useState } from 'react';
import axios from 'axios';
import './request.css';

const Form = () => {
  const [entries, setEntries] = useState([
    { MaterialCode: '', MaterialShortText: '', StockQuantity: '', UOM: '', PlantCode: '' }
  ]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index][name] = value || ''; // Ensure the value is not undefined
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { MaterialCode: '', MaterialShortText: '', StockQuantity: '', UOM: '', PlantCode: '' }]);
    showMessage('Entry added successfully.', 'success');
  };

  const handleDeleteEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    showMessage('Entry deleted successfully.', 'error');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const entry of entries) {
      if (Object.values(entry).some(value => value === '')) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }
      const isStockValid = await checkStockAvailability(entry.MaterialCode, entry.StockQuantity);
      if (!isStockValid) {
        showMessage(`Requested stock quantity for material code ${entry.MaterialCode} is more than available stock.`, 'error');
        return;
      }
    }
    console.log('Submitted Entries:', entries);
    showMessage('Form submitted successfully.', 'success');
  };

  const fetchMaterialData = async (index, query) => {
    try {
      const response = await axios.get(`http://localhost:7001/Request`, { params: query });
      if (response.data.length > 0) {
        const material = response.data[0];
        const newEntries = [...entries];
        newEntries[index] = {
          MaterialCode: material.MaterialCode,
          MaterialShortText: material.MaterialShortText,
          StockQuantity: material.StockQuantity,
          UOM: material.UOM,
          PlantCode: material.PlantCode
        };
        setEntries(newEntries);
        showMessage('Material data fetched successfully.', 'success');
      } else {
        showMessage('No material data found.', 'error');
      }
    } catch (error) {
      console.error('Error fetching material data:', error);
      showMessage('Error fetching material data.', 'error');
    }
  };

  const checkStockAvailability = async (materialCode, requestedQuantity) => {
    try {
      const response = await axios.get(`http://localhost:7001/CompareStock`, { params: { materialCode, requestedQuantity } });
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking stock availability:', error);
      showMessage('Error checking stock availability.', 'error');
      return false;
    }
  };

  return (
    <div className='form'>
      <h1 className='heading'>Store Requisition Voucher</h1>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Material Code</th>
              <th>Material Short Text</th>
              <th>Stock Quantity</th>
              <th>UOM</th>
              <th>Plant Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>
                  <input
                    name='MaterialCode'
                    type='text'
                    placeholder='Enter Material Code'
                    className='form-control'
                    value={entry.MaterialCode || ''} // Ensure value is always defined
                    onChange={(e) => handleInputChange(index, e)}
                    onBlur={() => fetchMaterialData(index, { code: entry.MaterialCode })}
                    required
                  />
                </td>
                <td>
                  <input
                    name='MaterialShortText'
                    type='text'
                    placeholder='Enter Material Short Text'
                    className='form-control'
                    value={entry.MaterialShortText || ''} // Ensure value is always defined
                    onChange={(e) => handleInputChange(index, e)}
                    onBlur={() => fetchMaterialData(index, { text: entry.MaterialShortText })}
                    required
                  />
                </td>
                <td>
                  <input
                    name='StockQuantity'
                    type='number'
                    placeholder='Enter Quantity'
                    className='form-control'
                    value={entry.StockQuantity || ''} // Ensure value is always defined
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name='UOM'
                    type='text'
                    placeholder='Enter UOM'
                    className='form-control'
                    value={entry.UOM || ''} // Ensure value is always defined
                    readOnly={!!entry.UOM}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name='PlantCode'
                    type='text'
                    placeholder='Enter Plant Code'
                    className='form-control'
                    value={entry.PlantCode || ''} // Ensure value is always defined
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <button
                    type='button'
                    className='delete-entry-btn'
                    onClick={() => handleDeleteEntry(index)}
                  >
                    - Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type='button' onClick={handleAddEntry} className='add-entry-btn'>+ Add Entry</button>
        <button type='submit' className='submit-btn'>Submit</button>
      </form>
    </div>
  );
};

export default Form;
