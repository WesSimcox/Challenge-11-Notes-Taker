const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const { notes } = require("./db/db.json");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

const generateUniqueId = require('generate-unique-id');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = generateUniqueId();
    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});