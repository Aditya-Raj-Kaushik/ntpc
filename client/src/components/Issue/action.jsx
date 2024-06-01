import React, { useState } from 'react';
import './issue.css';

// Initial data
const initialRequests = [
  {
    id: '0524000001',
    MaterialCode: 'M0713300992',
    MaterialShortText: 'PAINT-SYNTH-ENAMEL:IS:2932:GLOSSY:GREY RAL-9002 - 92775',
    StockQuantity: '600',
    UOM: 'L',
    PlantCode: '1005'
  },
  {
    id: '0524000001',
    MaterialCode: 'M0713301008',
    MaterialShortText: 'PAINT-SYNTH-ENAMEL:IS:2932:GLOSSY:LAVENDER RAL-4005 - 92791',
    StockQuantity: '230',
    UOM: 'L',
    PlantCode: '1005'
  },
  {
    id: '0524000003',
    MaterialCode: 'M0713300991',
    MaterialShortText: 'PAINT-SYNTH-ENAMEL:IS:2932:GLOSSY:WHITE RAL-9003 - 92776',
    StockQuantity: '450',
    UOM: 'L',
    PlantCode: '1005'
  }
];

const Action = () => {
  // Initialize state
  const [requests, setRequests] = useState(
    initialRequests.map(request => ({ ...request, status: 'Under Approval' }))
  );

  const [message, setMessage] = useState('');

  // Handle accept action
  const handleAccept = (id, index) => {
    const newRequests = requests.map((request, idx) => {
      if (request.id === id && idx === index) {
        return { ...request, status: 'Accepted' };
      }
      return request;
    });
    setRequests(newRequests);
    setMessage(`Request ID ${id} has been accepted.`);
  };

  // Handle reject action (remove from order)
  const handleReject = (id, index) => {
    const newRequests = requests.filter((request, idx) => !(request.id === id && idx === index));
    setRequests(newRequests);
    setMessage(`Request ID ${id} has been rejected and removed.`);
  };

  // Handle accept all action for a specific order
  const handleAcceptAll = (id) => {
    const newRequests = requests.map(request => {
      if (request.id === id) {
        return { ...request, status: 'Accepted' };
      }
      return request;
    });
    setRequests(newRequests);
    setMessage(`All requests for ID ${id} have been accepted.`);
  };

  // Handle reject all action for a specific order (clear all requests for that ID)
  const handleRejectAll = (id) => {
    const newRequests = requests.filter(request => request.id !== id);
    setRequests(newRequests);
    setMessage(`All requests for ID ${id} have been rejected and removed.`);
  };

  const groupedRequests = requests.reduce((acc, request) => {
    if (!acc[request.id]) {
      acc[request.id] = [];
    }
    acc[request.id].push(request);
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
          {Object.keys(groupedRequests).map((id) => (
            <div key={id} className="table__order-group">
              <h2>Request ID: {id}</h2>
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
                  {groupedRequests[id].map((request, index) => (
                    <tr key={index}>
                      <td>{request.MaterialCode}</td>
                      <td>{request.MaterialShortText}</td>
                      <td>{request.StockQuantity}</td>
                      <td>{request.UOM}</td>
                      <td>{request.PlantCode}</td>
                      <td>{request.status}</td>
                      <td className="table__action-buttons">
                        <button
                          className="table__btn table__btn--accept"
                          onClick={() => handleAccept(id, index)}
                          disabled={request.status === 'Accepted'}
                        >
                          Accept
                        </button>
                        <button
                          className="table__btn table__btn--reject"
                          onClick={() => handleReject(id, index)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table__bulk-actions">
                <button className="table__btn table__btn--accept-all" onClick={() => handleAcceptAll(id)}>Accept All</button>
                <button className="table__btn table__btn--reject-all" onClick={() => handleRejectAll(id)}>Reject All</button>
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
