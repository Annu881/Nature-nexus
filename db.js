const mongoose = require('mongoose');

// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/login_user_details'; // Correct port is 27017 for MongoDB

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error: ", err));
