const express = require('express');
const uuid = require('uuid');
const notes = require('./db/db.json');
const path = require('path')
const fs = require('fs');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) =>
    res.json(notes)
);

app.post('/api/notes', (req, res) => {

 const {title, text} = req.body;

 if (title && text) {
    const newNote = {
        title,
        text,
        id: uuid.v4(),
    };

    notes.push(newNote);

    fs.writeFile(`./db/db.json`, JSON.stringify(notes), (err) =>
        err ? console.error(err) : console.log(`New note has been written to JSON file`)
    );
    const response = {
        status: 'success',
        body: newNote,
     };
     console.log(response);
     res.status(201).json(response)
 } else {
    res.status(500).json('Need note title and note text')
 };
 });

 app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

 app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
 );