// Require the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/Truckrr')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB... '+err.message));

// Define a user schema
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String
});

// Define a user model
const User = mongoose.model('User', userSchema);

// Create an Express app
const app = express();

// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for registering a new user
app.post('/register', (req, res) => {
  // Extract the user data from the request body
  const { name, password, email } = req.body;

  // Create a new user object
  const user = new User({ name, password, email });

  // Save the user object to the database
  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering new user');
    } else {
      res.status(200).send('Welcome to the club!');
    }
  });
});

app.get('/users/:name', (req, res) => {
    // Extract the username parameter from the request
    const { name } = req.params;
  
    // Find the user in the database
    User.findOne({ name }, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving user data');
      } else if (!user) {
        res.status(404).send('User not found');
      } else {
        res.json(user);
      }
    });
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});