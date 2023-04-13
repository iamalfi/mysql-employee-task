const mysql = require("mysql2");
const express = require("express");
const app = express();
app.use(express.json());
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@testing123@",
    database: "employee",
});
connection.connect((err) => {
    if (err) {
        console.log(
            ` db connection failed \n error:` +
                JSON.stringify(err, undefined, 2)
        );
    } else {
        console.log(`db connection succeeded`);
    }
});
app.listen(3000, () => {
    console.log("server is running on http://localhost:3000/");
});

// get employees
app.get("/api/employeeDetails", (req, res) => {
    // const { page, limit } = req.query;
    // const offset = (page - 1) * limit;
    // const sql = `SELECT * FROM employees LIMIT ${limit} OFFSET ${offset}`;
    const sql = `SELECT * FROM employeeDetails`;

    connection.query(sql, (err, rows, feilds) => {
        if (err) throw err;
        res.status(200).send({
            rows,
            message: "employee details get successfully",
        });
    });
});
// get employee by id
app.get("/api/employeeDetails/:id", (req, res) => {
    connection.query(
        "SELECT * FROM employeeDetails WHERE id= ?",
        [req.params.id],
        (err, rows, feilds) => {
            if (err) throw err;
            res.status(200).send({
                rows,
                message: "employee details get successfully",
            });
        }
    );
});
// create employee
app.post("/api/employeeDetails", (req, res) => {
    let data = {
        employeeFullName: req.body.employeeFullName,
        jobTitle: req.body.jobTitle,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        primaryEmergencyContact: req.body.primaryEmergencyContact,
        primaryEmergencyContactPhoneNumber:
            req.body.primaryEmergencyContactPhoneNumber,
        primaryEmergencyContactRelationship:
            req.body.primaryEmergencyContactRelationship,
        secondaryEmergencyContact: req.body.secondaryEmergencyContact,
        secondaryEmergencyContactPhoneNumber:
            req.body.secondaryEmergencyContactPhoneNumber,
        secondaryEmergencyContactRelationship:
            req.body.secondaryEmergencyContactRelationship,
    };
    connection.query(
        "INSERT INTO employeeDetails SET ?",
        data,
        (err, rows, fields) => {
            if (err) throw err;
            if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(data.phoneNumber)) {
                //8880344456 918880344456  //+91 8880344456
                return res.status(400).send({
                    status: false,
                    message:
                        "Enter valid phone number it should be indian and ten digits",
                });
            }

            if (
                !/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(
                    data.secondaryEmergencyContactPhoneNumber
                )
            ) {
                //8880344456 918880344456  //+91 8880344456
                return res.status(400).send({
                    status: false,
                    message:
                        "Enter valid secondaryEmergencyContactPhoneNumber i should be indian and ten digits",
                });
            }
            if (
                !/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(
                    data.primaryEmergencyContactPhoneNumber
                )
            ) {
                //8880344456 918880344456  //+91 8880344456
                return res.status(400).send({
                    status: false,
                    message:
                        "Enter valid primaryEmergencyContactPhoneNumber it should be indian and ten digits",
                });
            }
            if (
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    data.email
                )
            )
                return res
                    .status(400)
                    .send({ status: false, msg: "please provide valid email" });

            // Include the newly created employee data in the response
            let responseData = {
                id: rows.insertId,
                employeeFullName: data.employeeFullName,
                jobTitle: data.jobTitle,
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                primaryEmergencyContact: data.primaryEmergencyContact,
                primaryEmergencyContactPhoneNumber:
                    data.primaryEmergencyContactPhoneNumber,
                primaryEmergencyContactRelationship:
                    data.primaryEmergencyContactRelationship,
                secondaryEmergencyContact: data.secondaryEmergencyContact,
                secondaryEmergencyContactPhoneNumber:
                    data.secondaryEmergencyContactPhoneNumber,
                secondaryEmergencyContactRelationship:
                    data.secondaryEmergencyContactRelationship,
            };

            res.status(201).send({
                data: responseData,
                message: "Employee created successfully",
            });
        }
    );
});
// delete employee
app.delete("/api/employeeDetails/:id", (req, res) => {
    connection.query(
        "DELETE FROM employeeDetails WHERE id= ?",
        [req.params.id],
        (err, rows, feilds) => {
            if (err) throw err;
            res.status(200).send({
                rows,
                message: "employee deleted successfully",
            });
        }
    );
});
// update employee
app.put("/api/employeeDetails/:id", (req, res) => {
    let sqlQuery =
        "UPDATE employeeDetails SET jobTitle='" +
        req.body.jobTitle +
        "', email='" +
        req.body.email +
        "',address='" +
        req.body.address +
        "',employeeFullName='" +
        req.body.employeeFullName +
        "',phoneNumber='" +
        req.body.phoneNumber +
        "',city='" +
        req.body.city +
        "',state='" +
        req.body.state +
        "',primaryEmergencyContact='" +
        req.body.primaryEmergencyContact +
        "',primaryEmergencyContactPhoneNumber='" +
        req.body.primaryEmergencyContactPhoneNumber +
        "',primaryEmergencyContactRelationship='" +
        req.body.primaryEmergencyContactRelationship +
        "',secondaryEmergencyContact='" +
        req.body.secondaryEmergencyContact +
        "',secondaryEmergencyContactPhoneNumber='" +
        req.body.secondaryEmergencyContactPhoneNumber +
        "',secondaryEmergencyContactRelationship='" +
        req.body.secondaryEmergencyContactRelationship +
        "'WHERE id=" +
        req.params.id;

    connection.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json({
            message: "employee etails updated successfully",
            results,
        });
    });
});
