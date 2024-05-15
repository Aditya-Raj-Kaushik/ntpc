import express from "express";
import mysql from "mysql";

const app = express();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost", 
    user: "root",
    password: "",
    database: "ntpc"
});

app.get("/", (req, res) => {
    pool.query("SELECT * FROM store", (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Data received from DB");
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



