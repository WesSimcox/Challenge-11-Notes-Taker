// Imported modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('generate-unique-id');

// Express app setup
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Sample data
const { notes } = require('./db/db.json');

// Routes
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes.html', (req, res) => {
    res.sendFile(path.join(__dirname, './notes.html'));
});

app.post('/api/notes', (req, res) => {
    req.body.id = generateUniqueId();
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

// Helper function to create a new note
function createNewNote(body, notesArray) {
  const newNote = body;
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return newNote;
}