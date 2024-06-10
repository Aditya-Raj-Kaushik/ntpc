import React, { useState, useEffect } from 'react';
import './issue.css';

const Action = () => {
  const [requests, setRequests] = useState({});
  const [message, setMessage] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:7001/issue');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      const groupedRequests = data.reduce((acc, request) => {
        acc[request.RequestID] = acc[request.RequestID] || [];
        acc[request.RequestID].push(request);
        return acc;
      }, {});
      setRequests(groupedRequests);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAccept = async (id, materialCodes) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialCodes })
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      const result = await response.json();
      setMessage(result.message);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleReject = async (id, materialCodes) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialCodes })
      });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      const result = await response.json();
      setMessage(result.message);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleModify = async (requestId, materialCode) => {
    const newQuantity = prompt('Enter the new quantity:');
    if (newQuantity) {
      try {
        const response = await fetch(`http://localhost:7001/issue/${requestId}/modify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materialCode, newQuantity })
        });
        if (!response.ok) {
          throw new Error('Failed to modify request');
        }
        const result = await response.json();
        setMessage(result.message);
        fetchRequests();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  const handleQuantityChange = (requestId, materialCode, value) => {
    setQuantities({
      ...quantities,
      [`${requestId}-${materialCode}`]: value
    });
  };

  const handleSubmit = async (id, transactionData) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionData })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();
      setMessage(result.message);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAcceptAll = async (id) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/accept-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to accept all materials');
      }
      const result = await response.json();
      setMessage(result.message);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleRejectAll = async (id) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/reject-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to reject all materials');
      }
      const result = await response.json();
      setMessage(result.message);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="table">
      <div className="table__header">
        <h1>Order Requests</h1>
      </div>
      {message && <p className="table__message">{message}</p>}
      {Object.keys(requests).length > 0 ? (
        <>
          {Object.entries(requests).map(([requestId, items]) => (
            <div key={requestId} className="table__order-group">
              <h2>Request ID: {requestId}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Material Code</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>UOM</th>
                    <th>Plant Code</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.MaterialCode}>
                      <td>{item.MaterialCode}</td>
                      <td>{item.MaterialShortText}</td>
                      <td>
                        <input
                          type="number"
                          value={quantities[`${requestId}-${item.MaterialCode}`] || item.StockQuantity}
                          onChange={(e) => handleQuantityChange(requestId, item.MaterialCode, e.target.value)}
                        />
                      </td>
                      <td>{item.UOM}</td>
                      <td>{item.PlantCode}</td>
                      <td>{item.Status}</td>
                      <td>
                        <div className="table__action-buttons">
                          <button className="table__btn table__btn--accept" onClick={() => handleAccept(requestId, [item.MaterialCode])}>Accept</button>
                          <button className="table__btn table__btn--reject" onClick={() => handleReject(requestId, [item.MaterialCode])}>Reject</button>
                          <button className="table__btn table__btn--modify" onClick={() => handleModify(requestId, item.MaterialCode)}>Modify</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table__bulk-actions">
                <button className="table__btn table__btn--submit" onClick={() => handleSubmit(requestId, items.map(item => ({
                  MaterialCode: item.MaterialCode,
                  Quantity: quantities[`${requestId}-${item.MaterialCode}`] || item.StockQuantity,
                  UOM: item.UOM,
                  PlantCode: item.PlantCode,
                  Status: item.Status
                })))}>Submit</button>
                <button className="table__btn table__btn--accept-all" onClick={() => handleAcceptAll(requestId)}>Accept All</button>
                <button className="table__btn table__btn--reject-all" onClick={() => handleRejectAll(requestId)}>Reject All</button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="table__no-requests">No requests available</p>
      )}
    </div>
  );
};

export default Action;
