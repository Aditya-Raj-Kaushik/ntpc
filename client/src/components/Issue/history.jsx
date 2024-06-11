
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7001/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the transactions!', error);
      });
  }, []);

  return (
    <div className="history-container">
      <h2>History of Transactions</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>RequestID</th>
            <th>MaterialCode</th>
            <th>MaterialShortText</th>
            <th>StockQuantity</th>
            <th>AllotedQT</th>
            <th>UOM</th>
            <th>PlantCode</th>
            <th>Status</th>
            <th>Attempt</th>
            <th>Issuedby</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.RequestID}</td>
              <td>{transaction.MaterialCode}</td>
              <td>{transaction.MaterialShortText}</td>
              <td>{transaction.StockQuantity}</td>
              <td>{transaction.AllotedQT}</td>
              <td>{transaction.UOM}</td>
              <td>{transaction.PlantCode}</td>
              <td>{transaction.Status}</td>
              <td>{transaction.Attempt}</td>
              <td>{transaction.Issuedby}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;