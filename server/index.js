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




const PORT = process.env.PORT || 7001;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
