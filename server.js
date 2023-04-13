const express = require("express");
const app = express();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
});

app.use(express.json());

app.post("/employees", (req, res) => {
    const {
        full_name,
        job_title,
        phone_number,
        email,
        address,
        city,
        state,
        primary_emergency_contact,
        secondary_emergency_contact,
    } = req.body;

    db.query(
        "INSERT INTO employees (full_name, job_title, phone_number, email, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [full_name, job_title, phone_number, email, address, city, state],
        (err, result) => {
            if (err) throw err;

            const employeeId = result.insertId;

            db.query(
                "INSERT INTO contacts (employee_id, contact_name, phone_number, relationship) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
                [
                    employeeId,
                    primary_emergency_contact.contact_name,
                    primary_emergency_contact.phone_number,
                    primary_emergency_contact.relationship,
                    employeeId,
                    secondary_emergency_contact.contact_name,
                    secondary_emergency_contact.phone_number,
                    secondary_emergency_contact.relationship,
                ],
                (err, result) => {
                    if (err) throw err;

                    res.send("Employee created successfully.");
                }
            );
        }
    );
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
