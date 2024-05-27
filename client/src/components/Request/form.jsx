import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './request.css';

const Form = () => {
  const [entries, setEntries] = useState([
    {
      MaterialCode: '',
      MaterialShortText: '',
      StockQuantity: '',
      UOM: '',
      PlantCode: ''
    }
  ]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    console.log('Entries:', entries);
  }, [entries]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);

    if (name === 'MaterialCode' || name === 'MaterialShortText') {
      fetchMaterialDetails(value, index);
    }
  };

  const fetchMaterialDetails = async (query, index) => {
    try {
      const response = await axios.post('http://localhost:7001/request', { query });
      const { MaterialCode, MaterialShortText, UOM, PlantCode } = response.data;
      const newEntries = [...entries];
      newEntries[index] = {
        ...newEntries[index],
        MaterialCode,
        MaterialShortText,
        UOM,
        PlantCode
      };
      setEntries(newEntries);
      showMessage('Material details fetched successfully.', 'success');
    } catch (error) {
      showMessage('Invalid material code or short text', 'error');
    }
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        MaterialCode: '',
        MaterialShortText: '',
        StockQuantity: '',
        UOM: '',
        PlantCode: ''
      }
    ]);
    showMessage('Entry added successfully.', 'success');
  };

  const handleDeleteEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    showMessage('Entry deleted successfully.', 'error');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    for (let entry of entries) {
      for (let key in entry) {
        if (!entry[key]) {
          showMessage('Please fill in all fields before submitting.', 'error');
          return;
        }
      }
    }

    console.log('Submitted Entries:', entries);
    showMessage('Form submitted successfully.', 'success');
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
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
                    value={entry.MaterialCode}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    name='MaterialShortText'
                    type='text'
                    placeholder='Enter Material Short Text'
                    className='form-control'
                    value={entry.MaterialShortText}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    name='StockQuantity'
                    type='number'
                    placeholder='Enter Quantity'
                    className='form-control'
                    value={entry.StockQuantity}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <select
                    name='UOM'
                    className='form-control'
                    value={entry.UOM}
                    onChange={(e) => handleInputChange(index, e)}
                  >
                    <option value=''>Select UOM</option>
                    <option value='kg'>kg</option>
                    <option value='lbs'>lbs</option>
                    <option value='pieces'>pieces</option>
                    <option value='litre'>litre</option>
                  </select>
                </td>
                <td>
                  <input
                    name='PlantCode'
                    type='number'
                    placeholder='Enter Plant Code'
                    className='form-control'
                    value={entry.PlantCode}
                    onChange={(e) => handleInputChange(index, e)}
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
