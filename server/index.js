const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: '',
    database: 'ntpc'
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

app.post('/register', (req, res) => {
    const sentEmail = req.body.Email;
    const sentPassword = req.body.Password;

    const SQL = 'INSERT INTO employee (EmailID, Password) VALUES (?, ?)';
    const Values = [sentEmail, sentPassword];

    db.query(SQL, Values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            console.log('User inserted successfully');
            res.status(201).send({ message: 'User added' });
        }
    });
});


app.post('/login', (req, res) => {
    const sentLoginEmail = req.body.LoginEmail;
    const sentLoginPassword = req.body.LoginPassword;

    const SQL = 'SELECT * FROM employee WHERE EmailID = ? AND Password = ?';
    const values = [sentLoginEmail, sentLoginPassword];

    db.query(SQL, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        if (results.length > 0) {
            return res.status(200).send('Login successful');
        }
        else {
            return res.status(401).send('Invalid email or password');
        }
    });
});

