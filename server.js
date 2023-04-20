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
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        err ? console.error(err) : res.json(JSON.parse(data))
    })
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

 app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id
    console.log(`ID: ${noteId}`)

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            throw err
        }
        const newNotes = JSON.parse(data).filter(note => note.id != noteId)

        fs.writeFile("./db/db.json", JSON.stringify(newNotes, null, 4), (err) => {
            if (err) {
                throw err
            }

            fs.readFile("./db/db.json", "utf-8", (err, data) => {
                err? console.log(err) : res.json(JSON.stringify(data))
            });
        });
    });    
});

 app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

 app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
 );