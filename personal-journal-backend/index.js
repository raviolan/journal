const express = require('express');
const cors = require('cors'); // Import the cors module
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Route to test the server
app.get('/', (req, res) => {
    res.send('Personal Journal Backend is running!');
});

// Password verification route
const correctPassword = 'mypassword'; // Replace with a securely stored password in a real app

app.post('/api/verify-password', (req, res) => {
    console.log('Password verification request received:', req.body); // Log request body

    const { password } = req.body;

    if (password === correctPassword) {
        console.log('Password verified successfully.');
        res.json({ success: true, message: 'Password correct!' });
    } else {
        console.log('Incorrect password attempt.');
        res.json({ success: false, message: 'Incorrect password.' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
