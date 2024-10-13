const express = require('express');
const cors = require('cors');
// Import the mysql2 package
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // For parsing application/json

const PORT = 3000;

app.post('/testserver', (req, res) => {
  res.send('API FitLife is working');
})

app.post('/testmysqlconnection', (req, res) => {
  queryDatabase(res)
});

// Function to create a connection to the MySQL database
function connectToMySQL() {
  // Create a connection object
  const connection = mysql.createConnection({
    host: 'localhost', // Your MySQL server IP
    user: 'root',  // Your MySQL username
    password: '',  // Your MySQL password
    database: 'audition',  // The name of the database you want to connect to
    port: 3306,  // Default MySQL port is 3306, change if different
  });

  // Establish the connection
  connection.connect(function (err) {
    if (err) {
      console.error('Error connecting to the MySQL database:', err);
      return;
    }
    console.log('Connected to the MySQL database successfully!');
  });

  // Return the connection object so it can be used in queries
  return connection;
}

// test get data from database
function queryDatabase(res) {
  const connection = connectToMySQL();

  // Query the database (replace with your actual query)
  connection.query('SELECT * FROM users', function (error, results) {
    if (error) {
            console.error('Error executing the query:', error);
            res.status(500).send('An error occurred while querying the database');  // Send error to the client
            return;
        }
    // Send the results of the query back to the client
    res.json(results);
  });

  // Close the connection when done
  connection.end();
}

// Define the POST route for inserting user data
app.post('/addUser', (req, res) => {
    const { userid, name, acctype, picture } = req.body; // Extract data from the request body

    // Call the function to insert the user data into the database
    insertUser(userid, name, acctype, picture, res);
});

// Function to insert data into the 'users' table
function insertUser(userid, name, acctype, picture, res) {
    const connection = connectToMySQL();

    // SQL query for inserting data
    const insertQuery = 'INSERT INTO users (userid, name, acctype, picture) VALUES (?, ?, ?, ?)';

    // Execute the query with the data from the client
    connection.query(insertQuery, [userid, name, acctype, picture], (error, results) => {
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).send('Failed to insert user data');
            return;
        }

        // If successful, send a success message to the client
        res.status(200).send('User data inserted successfully');
    });

    // Close the database connection
    connection.end();
}

// Define the POST route to check if the user exists
app.post('/checkUser', (req, res) => {
    const { userid } = req.body; // Extract the userid from the request body

    // Call the function to check if the user exists in the database
    checkUserExistence(userid, res);
});

// Function to check if a user exists in the 'users' table
function checkUserExistence(userid, res) {
    const connection = connectToMySQL();

    // SQL query to check if the user exists by their userid
    const checkQuery = 'SELECT COUNT(*) AS userCount FROM users WHERE userid = ?';

    // Execute the query with the provided userid
    connection.query(checkQuery, [userid], (error, results) => {
        if (error) {
            console.error('Error checking user existence:', error);
            res.status(500).send('An error occurred while checking the user');
            return;
        }

        // Check the result to see if the user exists
        const userExists = results[0].userCount > 0;

        if (userExists) {
            res.status(200).send('User exists');
        } else {
            res.status(404).send('User does not exist');
        }
    });

    // Close the database connection
    connection.end();
}


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});



