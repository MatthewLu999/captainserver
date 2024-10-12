const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // For parsing application/json

const PORT = 3000;
// connect to MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://luminhphuc258:capstoneproject@healthcaredatabase.2flen.mongodb.net/?retryWrites=true&w=majority&appName=HealthCareDatabase";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.post('/testserver', (req, res) => {
  res.send('API FitLife is working');
})


app.post('/Adduser', (req, res) => {
  res.send('API is working');
  const { username, password, accounttype, picture } = req.body;
  run(username, password, accounttype, picture).catch(console.dir);
});

app.post('/CheckUser', (req, res) => {
  const { username, password, accounttype, picture } = req.body;
  // Assuming checkExistUser is a function that returns a promise
  checkExistUser(username, password, accounttype, picture).catch(console.dir);
});

async function checkExistUser(username, password, accounttype, picture) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("fit_life_databse").command({ ping: 1 });
    const db = await client.db("fit_life_databse");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    if (!db) {
      return { error: "Failed to connect to database" };
    }
    try {
      const user = await db.collection('users').findOne({ username });
      if (user) {
        console.log("User exists:", user);
        return true; // User exists
      } else {
        console.log("User does not exist");
        console.log("User info new:", accounttype);
        await run(username, password, accounttype, picture).catch(console.dir);
        return false; // User does not exist
      }
    } catch (error) {
      console.error('Error finding user:', error);
      return { error: error.message };
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return { error: error.message };
  } finally {
    await client.close();
  }
}

async function run(username, password, accounttype, picture) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("fit_life_databse").command({ ping: 1 });
    const db = await client.db("fit_life_databse");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    if (!db) {
      return { error: "Failed to connect to database" };
    }
    try {
      const newUser = {
        username: username,
        password: password,
        accountype: accounttype,
        picture: picture
      };
      const result = await db.collection('users').insertOne(newUser);
      console.log(`New user added with the following id: ${result.insertedId}`);
      return { insertedId: result.insertedId };
    } catch (error) {
      console.error('Error adding user:', error);
      return { error: error.message };
    } finally {
      await client.close(); // Ensure you close the connection after the operation
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});



