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
  queryDatabase()
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
async function queryDatabase() {
  const connection = await connectToMySQL();

  // Query the database (replace with your actual query)
  await connection.query('SELECT * FROM users', function (error, results) {
    if (error) {
      console.error('Error executing the query:', error);
      return;
    }

    // Log the results of the query
    console.log('Query Results:', results);
  });

  // Close the connection when done
  connection.end();
}


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});



