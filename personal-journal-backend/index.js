const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./journal.db', (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});
db.run(`
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);


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

//Fetch all journal entries in the database
app.get('/api/entries', (req, res) => {
    db.all('SELECT * FROM entries ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch entries' });
        } else {
            res.json(rows);
        }
    });
});

//add new journal entry
app.post('/api/entries', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    db.run('INSERT INTO entries (title, content) VALUES (?, ?)', [title, content], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to add entry' });
        } else {
            res.json({ id: this.lastID, title, content });
        }
    });
});

//deleta a journal entry by ID
app.delete('/api/entries/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM entries WHERE id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete entry' });
        } else {
            res.json({ success: true });
        }
    });
});
