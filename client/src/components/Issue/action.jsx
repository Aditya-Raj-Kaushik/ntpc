import React, { useState, useEffect } from 'react';
import './issue.css';

const Action = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

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
      setRequests(data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      setMessage(`Request ID ${id} has been accepted.`);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:7001/issue/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      setMessage(`Request ID ${id} has been rejected and removed.`);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAcceptAll = async (requestID) => {
    try {
      await Promise.all(
        requests
          .filter(request => request.RequestID === requestID)
          .map(request =>
            fetch(`http://localhost:7001/issue/${request.RequestID}/accept`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            })
          )
      );
      setMessage(`All requests for Request ID ${requestID} have been accepted.`);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleRejectAll = async (requestID) => {
    try {
      await Promise.all(
        requests
          .filter(request => request.RequestID === requestID)
          .map(request =>
            fetch(`http://localhost:7001/issue/${request.RequestID}/reject`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            })
          )
      );
      setMessage(`All requests for Request ID ${requestID} have been rejected and removed.`);
      fetchRequests();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Group requests by RequestID
  const groupedRequests = requests.reduce((acc, request) => {
    acc[request.RequestID] = acc[request.RequestID] || [];
    acc[request.RequestID].push(request);
    return acc;
  }, {});

  return (
    <div className="table">
      <div className="table__header">
        <h1>Order Requests</h1>
      </div>
      {message && <p className="table__message">{message}</p>}
      {Object.keys(groupedRequests).length > 0 ? (
        <>
          {Object.keys(groupedRequests).map(requestID => (
            <div key={requestID} className="table__order-group">
              <h2>Request ID: {requestID}</h2>
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
                  {groupedRequests[requestID].map(request => (
                    <tr key={request.MaterialCode}>
                      <td>{request.MaterialCode}</td>
                      <td>{request.MaterialShortText}</td>
                      <td>{request.StockQuantity}</td>
                      <td>{request.UOM}</td>
                      <td>{request.PlantCode}</td>
                      <td>{request.Status}</td>
                      <td>
                        <button className="table__btn table__btn--accept" onClick={() => handleAccept(request.RequestID)}>Accept</button>
                        <button className="table__btn table__btn--reject" onClick={() => handleReject(request.RequestID)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table__bulk-actions">
                <button className="table__btn table__btn--accept-all" onClick={() => handleAcceptAll(requestID)}>Accept All</button>
                <button className="table__btn table__btn--reject-all" onClick={() => handleRejectAll(requestID)}>Reject All</button>
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
