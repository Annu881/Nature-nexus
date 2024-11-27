const express = require('express');

const User = require('./userschema.js');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Import DB configuration
 require('./db.js');

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    
    if (!email || !password) {
        return res.status(400).send("Email and Password are required");
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User  found kindly login");
            return res.status(400).send("User already exists")
        }
        else
        {
            const newUser = new User({ email, password });
            await newUser.save();
            console.log("User saved successfully");
        }
        
    } catch (err) {
        res.status(500).send("Error saving user");
        console.error(err);
    }
});

app.delete('/delete-account', async (req, res) => {
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


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
