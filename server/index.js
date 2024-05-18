const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.listen(3002, () => {
    console.log('Running on port 3002');
});

app.post('/register', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);

        const SQL = 'INSERT INTO employee (EmailID, Password) VALUES (?, ?)';
        const values = [Email, hashedPassword];

        db.query(SQL, values, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database error' });
            } else {
                console.log('User inserted successfully');
                res.status(201).send({ message: 'User added' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/login', (req, res) => {
    const { LoginEmail, LoginPassword } = req.body;

    const SQL = 'SELECT * FROM employee WHERE EmailID = ?';
    const values = [LoginEmail];

    db.query(SQL, values, async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(LoginPassword, user.Password);

            if (passwordMatch) {
                return res.status(200).send({ message: 'Login successful' });
            } else {
                return res.status(401).send({ error: 'Invalid email or password' });
            }
        } else {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
    });
});
