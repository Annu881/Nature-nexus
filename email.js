const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://vaibhavkota7605:Rs52xX2cnZPwuH9z@cluster0.mug6b.mongodb.net/sweatsmart?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema 
const userSchema = new mongoose.Schema({
    countryCode: String,
    firstName: String,
    lastName: String,
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: String,
    userToken: String,
    deviceId: String,
});

const User = mongoose.model('User', userSchema);

// Check email endpoint
app.post('/api/check-email', async (req, res) => {
    const { email } = req.body;  

    // Validate input
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') }  
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        res.status(200).json({ message: 'Email does not exist' });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Error checking email', error: error.message });
    }
});// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { countryCode, firstName, lastName, email, mobileNumber, userToken, deviceId } = req.body;

    // Validate input
    if (!email || !firstName || !lastName || !mobileNumber) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Create a new user
        const newUser = new User({
            countryCode,
            firstName,
            lastName,
            email,
            mobileNumber,
            userToken,
            deviceId,
        });


         // Save the user in the database
         await newUser.save();

         res.status(201).json({ message: 'User registered successfully', user: newUser });
     } catch (error) {
         console.error('Error registering user:', error);
         res.status(500).json({ message: 'Error registering user', error: error.message });
     }
 });
 // Delete account endpoint
app.delete('/api/delete-account', async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Find and delete the user by email
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

