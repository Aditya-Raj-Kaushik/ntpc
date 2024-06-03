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













  let sequenceNumber = 0;

const generateRequestID = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(now.getFullYear()).slice(-2); // Last two digits of the year
    const orderNumber = String(sequenceNumber).padStart(6, '0'); // Sequence number with leading zeros
    sequenceNumber = (sequenceNumber + 1) % 1000000; // Increment sequence number and reset after 999999
    return `${month}${year}${orderNumber}`;
};

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
            'inprogress'
        ]);

        queries.push({ query: 'INSERT INTO request (RequestID, MaterialCode, MaterialShortText, StockQuantity, UOM, PlantCode, Status) VALUES ?', values });
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




// Get requests
app.get('/issue', (req, res) => {
  const query = 'SELECT RequestID, MaterialCode, MaterialShortText, StockQuantity, UOM, PlantCode, Status FROM request';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching requests:', error);
      return res.status(500).json({ message: 'Failed to fetch requests', error });
    }
    res.json(results);
  });
});

// Accept request
app.post('/issue/:id/accept', (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE request SET Status = "Accepted" WHERE RequestID = ?';
  db.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error accepting request:', error);
      return res.status(500).json({ message: 'Failed to accept request', error });
    }
    res.json({ message: `Request ID ${id} has been accepted.` });
  });
});

// Reject request
app.post('/issue/:id/reject', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM request WHERE RequestID = ?';
  db.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error rejecting request:', error);
      return res.status(500).json({ message: 'Failed to reject request', error });
    }
    res.json({ message: `Request ID ${id} has been rejected and removed.` });
  });
});




  


const PORT = process.env.PORT || 7001;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


