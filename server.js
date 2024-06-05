let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mySql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// home page
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API with NOdeJS, Express, MYSQL',
        written_by: 'kanisorn',
        published_on: 'https://milerdev.dev'
    })
})

// connection to mysql database
let dbCon = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'nodejs_api'
})
dbCon.connect();

// retrieve all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if(error) throw error;

        let message = ""
        if(results === undefined || results.length == 0) {
            message = "Books table is empty";
        } else {
            message = "Successfully retrieve all books";
        }
        return res.send({error: false, data: results, message:message});
    })
})

// add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if(!name || !author) {
        return res.status(400).send({error: true, message: "Please provide book name and aurthor.!"});
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) => {
            if(error) throw error;
            return res.send({error: false, data: results, message: "Book successfully added."})
        })
    }
})

app.listen(3000, ()=>{
    console.log('Node App is running on port 3000');
})

module.exports = app;