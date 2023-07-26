// app.js (or index.js)

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Middleware to parse JSON data from the request body
app.use(express.json());

// Path to the db.json file
const dbPath = path.join(__dirname, 'db.json');

// Create db.json with an empty array if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '[]', 'utf8');
}

// Route to return the notes.html file
app.get('/notes', (req, res) => {
  const notesFilePath = path.join(__dirname, 'public', 'notes.html');
  res.sendFile(notesFilePath);
});

// Route to return the index.html file for all other routes
app.get('*', (req, res) => {
  const indexFilePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexFilePath);
});

// Route to get all saved notes as JSON
app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Route to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Assign a unique ID to the new note

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save the note.' });
      }
      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
