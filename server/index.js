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









  app.post('/SubmitEntries', (req, res) => {
    // Handle the form submission logic here
    console.log(req.body); // Print the submitted entries
    res.status(200).send({ message: 'Entries submitted successfully' });
  });


  


const PORT = process.env.PORT || 7001;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


