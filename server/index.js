const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config(); // Import dotenv for environment variables




const app = express();
app.use(express.json());





// Configure CORS to allow requests from the frontend origin
app.use(cors({
    origin: 'http://localhost:5173'
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ntpc'
});





// Handle login
app.post('/login', (req, res) => {
  try {
      const { Email, Password } = req.body;
      const SQL = 'SELECT * FROM employee WHERE EmailID = ? AND Password = ?';
      const values = [Email, Password];
      db.query(SQL, values, (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send({ success: false, error: 'Internal server error' });
          }
          if (results.length > 0) {
              return res.status(200).send({ success: true, message: 'Login successful' });
          } else {
              return res.status(401).send({ success: false, error: 'Invalid email or password' });
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: 'Internal server error' });
  }
});


// Handle registration
app.post('/register', (req, res) => {
  try {
      const { Email, Password } = req.body;
      const SQL = 'INSERT INTO employee (EmailID, Password) VALUES (?, ?)';
      const values = [Email, Password];
      db.query(SQL, values, (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send({ error: 'Database error' });
          } else {
              console.log('User inserted successfully');
              return res.status(201).send({ message: 'User added' });
          }
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
  }
});

app.get('/Overview', (req, res) => {
    db.query('SELECT * FROM store', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});


let sequenceNumber = 0;

const generateRequestID = () => {
  const now = new Date();
  
  // Extract month and year
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);

  // Generate order number with leading zeros
  const orderNumber = String(sequenceNumber).padStart(6, '0');

  // Increment sequence number and reset after 999999
  sequenceNumber = (sequenceNumber + 1) % 1000000;

  return `${month}${year}${orderNumber}`;
};


app.get('/Request', (req, res) => {
    const { code, text } = req.query;
    let query = 'SELECT MaterialCode,MaterialShortText,UOM FROM store WHERE';
  
    if (code) {
      query += ` MaterialCode = '${code}'`;
    } else if (text) {
      query += ` MaterialShortText LIKE '%${text}%'`;
    }
  
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  });





  app.get('/CompareStock', (req, res) => {
    const { materialCode, requestedQuantity } = req.query;
  
    if (!materialCode || !requestedQuantity) {
      return res.status(400).json({ error: 'MaterialCode and requestedQuantity are required' });
    }
  
    const query = 'SELECT StockQuantity FROM store WHERE MaterialCode = ?';
  
    db.query(query, [materialCode], (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Material code not found' });
      } else {
        const availableStock = results[0].StockQuantity;
        const isAvailable = parseInt(requestedQuantity, 10) <= availableStock;
        res.json({ isAvailable, availableStock });
      }
    });
  });





app.post('/SubmitEntries', (req, res) => {
    const materials = req.body;
    
    if (!materials || !Array.isArray(materials) || materials.length === 0) {
        return res.status(400).send({ message: 'Materials are required and should be an array' });
    }

    // Group materials by 'id'
    const groupedMaterials = materials.reduce((acc, material) => {
        if (!acc[material.id]) {
            acc[material.id] = [];
        }
        acc[material.id].push(material);
        return acc;
    }, {});

    // Prepare queries for each group
    const queries = [];
    const requestIDMap = {};

    for (const [id, materials] of Object.entries(groupedMaterials)) {
        const requestID = generateRequestID();
        requestIDMap[id] = requestID;

        const values = materials.map(material => [
            requestID,
            material.MaterialCode,
            material.MaterialShortText,
            material.StockQuantity,
            material.UOM,
            material.PlantCode,
            'inprogress',
            'No'
        ]);

        queries.push({ query: 'INSERT INTO request (RequestID, MaterialCode, MaterialShortText, StockQuantity, UOM, PlantCode, Status, Attempt) VALUES ?', values });
    }

    // Execute all queries
    let queriesCompleted = 0;
    for (const { query, values } of queries) {
        db.query(query, [values], (error, results) => {
            queriesCompleted++;
            if (error) {
                console.error('Failed to insert data:', error);
                if (queriesCompleted === queries.length) {
                    return res.status(500).send({ message: 'Failed to submit entries' });
                }
            } else {
                if (queriesCompleted === queries.length) {
                    console.log('Data inserted successfully');
                    res.status(200).send({ message: 'Entries submitted successfully', requestIDMap });
                }
            }
        });
    }
});


app.get('/issue', (req, res) => {
  const query = 'SELECT RequestID, MaterialCode, MaterialShortText, StockQuantity, UOM, PlantCode, Status FROM request WHERE Attempt = "No"';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching requests:', error);
      return res.status(500).json({ message: 'Failed to fetch requests', error });
    }
    res.json(results);
  });
});


app.post('/issue/:id/accept', (req, res) => {
  const id = req.params.id;
  const materialCodes = req.body.materialCodes; // Expecting an array of MaterialCodes

  // Query to update Status and set AllotedQT equal to StockQuantity for specific MaterialCodes
  const updateQuery = `
    UPDATE request
    SET Status = 'Accepted', AllotedQT = StockQuantity
    WHERE RequestID = ? AND MaterialCode IN (?)
  `;
  const selectQuery = 'SELECT MaterialCode, Status, AllotedQT FROM request WHERE RequestID = ?';

  db.query(updateQuery, [id, materialCodes], (error, result) => {
    if (error) {
      console.error('Error accepting materials:', error);
      return res.status(500).json({ message: 'Failed to accept materials', error });
    }

    db.query(selectQuery, [id], (error, results) => {
      if (error) {
        console.error('Error fetching updated materials:', error);
        return res.status(500).json({ message: 'Failed to fetch updated materials', error });
      }
      res.json({ message: `Selected materials for Request ID ${id} have been accepted.`, materials: results });
    });
  });
});



app.post('/issue/:id/reject', (req, res) => {
  const id = req.params.id;
  const materialCodes = req.body.materialCodes; // Expecting an array of MaterialCodes
  const updateQuery = 'UPDATE request SET Status = "Rejected" WHERE RequestID = ? AND MaterialCode IN (?)';
  const selectQuery = 'SELECT MaterialCode, Status FROM request WHERE RequestID = ?';

  db.query(updateQuery, [id, materialCodes], (error, result) => {
    if (error) {
      console.error('Error rejecting materials:', error);
      return res.status(500).json({ message: 'Failed to reject materials', error });
    }

    db.query(selectQuery, [id], (error, results) => {
      if (error) {
        console.error('Error fetching updated materials:', error);
        return res.status(500).json({ message: 'Failed to fetch updated materials', error });
      }
      res.json({ message: `Selected materials for Request ID ${id} have been rejected.`, materials: results });
    });
  });
});


app.post('/issue/:id/accept-all', (req, res) => {
  const id = req.params.id;

  // Query to update Status and set AllotedQT equal to StockQuantity for all MaterialCodes
  const updateQuery = `
    UPDATE request
    SET Status = 'Accepted', AllotedQT = StockQuantity
    WHERE RequestID = ?
  `;
  const selectQuery = 'SELECT MaterialCode, Status, AllotedQT FROM request WHERE RequestID = ?';

  db.query(updateQuery, [id], (error, result) => {
    if (error) {
      console.error('Error accepting all materials:', error);
      return res.status(500).json({ message: 'Failed to accept all materials', error });
    }

    db.query(selectQuery, [id], (error, results) => {
      if (error) {
        console.error('Error fetching updated materials:', error);
        return res.status(500).json({ message: 'Failed to fetch updated materials', error });
      }
      res.json({ message: `All materials for Request ID ${id} have been accepted.`, materials: results });
    });
  });
});



app.post('/issue/:id/reject-all', (req, res) => {
  const id = req.params.id;
  const updateQuery = 'UPDATE request SET Status = "Rejected" WHERE RequestID = ?';
  const selectQuery = 'SELECT MaterialCode, Status FROM request WHERE RequestID = ?';

  db.query(updateQuery, [id], (error, result) => {
    if (error) {
      console.error('Error rejecting all materials:', error);
      return res.status(500).json({ message: 'Failed to reject all materials', error });
    }

    db.query(selectQuery, [id], (error, results) => {
      if (error) {
        console.error('Error fetching updated materials:', error);
        return res.status(500).json({ message: 'Failed to fetch updated materials', error });
      }
      res.json({ message: `All materials for Request ID ${id} have been rejected.`, materials: results });
    });
  });
});


app.post('/issue/:id/modify', (req, res) => {
  const id = req.params.id;
  const { materialCode, newQuantity } = req.body;

  // Query to get the current StockQuantity
  const getQuery = 'SELECT StockQuantity FROM request WHERE RequestID = ? AND MaterialCode = ?';

  db.query(getQuery, [id, materialCode], (getError, getResult) => {
    if (getError) {
      console.error('Error fetching current stock quantity:', getError);
      return res.status(500).json({ message: 'Failed to fetch current stock quantity', error: getError });
    }

    if (getResult.length === 0) {
      return res.status(404).json({ message: 'Request ID or Material Code not found' });
    }

    const currentQuantity = getResult[0].StockQuantity;
    const status = newQuantity < currentQuantity ? 'Reduced&Accepted' : 'Increased&Accepted';

    // Query to update AllotedQT and Status
    const updateQuery = 'UPDATE request SET AllotedQT = ?, Status = ? WHERE RequestID = ? AND MaterialCode = ?';

    db.query(updateQuery, [newQuantity, status, id, materialCode], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error modifying request:', updateError);
        return res.status(500).json({ message: 'Failed to modify request', error: updateError });
      }
      res.json({ message: `Request ID ${id} and Material Code ${materialCode} has been modified to quantity ${newQuantity}.`, status });
    });
  });
});



app.post('/issue/:id/submit', (req, res) => {
  const id = req.params.id;
  const { transactionData } = req.body;

  if (!transactionData || !Array.isArray(transactionData)) {
    return res.status(400).json({ message: 'Invalid transaction data' });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Failed to start transaction', error: err });
    }

    const selectQuery = 'SELECT RequestID, MaterialCode, MaterialShortText, StockQuantity, AllotedQT, UOM, PlantCode, Status, Attempt FROM request WHERE RequestID = ?';
    db.query(selectQuery, [id], (selectError, selectResults) => {
      if (selectError) {
        return db.rollback(() => {
          console.error('Error selecting from request table:', selectError);
          return res.status(500).json({ message: 'Failed to select from request table', error: selectError });
        });
      }

      if (selectResults.length === 0) {
        return db.rollback(() => {
          console.error('No matching request found');
          return res.status(404).json({ message: 'No matching request found' });
        });
      }

      const requestData = selectResults[0];
      const transactionValues = transactionData.map(data => [
        requestData.RequestID,
        requestData.MaterialCode,
        requestData.MaterialShortText,
        requestData.StockQuantity,
        requestData.AllotedQT,
        requestData.UOM,
        requestData.PlantCode,
        requestData.Status,
        requestData.Attempt
      ]);

      const insertQuery = 'INSERT INTO transaction (RequestID, MaterialCode, MaterialShortText, StockQuantity, AllotedQT, UOM, PlantCode, Status, Attempt) VALUES ?';
      db.query(insertQuery, [transactionValues], (insertError, insertResult) => {
        if (insertError) {
          return db.rollback(() => {
            console.error('Error inserting into transaction table:', insertError);
            return res.status(500).json({ message: 'Failed to insert into transaction table', error: insertError });
          });
        }

        const updateQuery = 'UPDATE request SET Attempt = "Yes" WHERE RequestID = ?';
        db.query(updateQuery, [id], (updateError, updateResult) => {
          if (updateError) {
            return db.rollback(() => {
              console.error('Error updating request attempt:', updateError);
              return res.status(500).json({ message: 'Failed to update request attempt', error: updateError });
            });
          }

          const quantityToSubtract = requestData.AllotedQT === 0 ? requestData.StockQuantity : requestData.AllotedQT;
          const subtractStockQuery = 'UPDATE store SET StockQuantity = StockQuantity - ? WHERE MaterialCode = ? AND PlantCode = ?';
          db.query(subtractStockQuery, [quantityToSubtract, requestData.MaterialCode, requestData.PlantCode], (subtractError, subtractResult) => {
            if (subtractError) {
              return db.rollback(() => {
                console.error('Error updating store stock quantity:', subtractError);
                return res.status(500).json({ message: 'Failed to update store stock quantity', error: subtractError });
              });
            }

            db.commit((commitError) => {
              if (commitError) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', commitError);
                  return res.status(500).json({ message: 'Failed to commit transaction', error: commitError });
                });
              }

              res.json({ message: `Request ID ${id} has been submitted, Attempt set to Yes, and store stock quantity updated.` });
            });
          });
        });
      });
    });
  });
});


// Endpoint to fetch transactions
app.get('/transactions', (req, res) => {
  db.query('SELECT * FROM transaction', (error, results) => {
    if (error) {
      console.error('Database query failed:', error); // Log the error
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    res.json(results);
  });
});


app.get('/fetch', (req, res) => {
  const { code, text } = req.query;
  let query = 'SELECT MaterialCode, MaterialShortText, UOM FROM store WHERE';

  if (code) {
    query += ` MaterialCode = '${code}'`;
  } else if (text) {
    query += ` MaterialShortText LIKE '%${text}%'`;
  }

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});



app.get('/fetchVendor', (req, res) => {
  const { vendorCode } = req.query;

  if (!vendorCode) {
    return res.status(400).send('Vendor code is required');
  }

  const query = `SELECT Vcode, Vendor, Location FROM vendor WHERE Vcode = ?`;
  db.query(query, [vendorCode], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Vendor not found');
    }
  });
});



app.post('/submitReceipt', (req, res) => {
  const receiptData = req.body;
  console.log('Received receipt data:', receiptData);
  
  const { poNo, poDate, vendor, vendorCode, location, receiptDate, lrNo, lrDate, materials } = receiptData;
  
  // Prepare materials data to be inserted
  const materialsValues = materials.map(material => [
    poNo, poDate, material.materialCode, material.materialShortText, 
    material.quantity, material.uom, vendor, vendorCode, 
    location, receiptDate, lrNo, lrDate
  ]);
  
  // Insert receipt and materials into 'receipt' table
  const insertReceiptQuery = `
    INSERT INTO receipt (
      \`PONo.\`, \`PODate\`, \`MaterialCode\`, \`MaterialShortText\`, \`Quantity\`, \`UOM\`, 
      \`Vendor\`, \`VendorCode\`, \`Location\`, \`ReceiptDate\`, \`LRNo.\`, \`LRDate\`
    ) VALUES ?
  `;
  
  db.query(insertReceiptQuery, [materialsValues], (err, result) => {
    if (err) {
      console.error('Error inserting receipt:', err);
      return res.status(500).send('Error inserting receipt');
    }
    
    console.log('Receipt inserted successfully');
    res.status(200).send('Receipt submitted successfully');
  });
});




const PORT = process.env.PORT || 7001;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


