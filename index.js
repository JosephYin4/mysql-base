const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/', (req,res) => {
        res.send('Hello, World!');
    });

    //Display the User_Details Table Data
    app.get('/userdetail', async (req, res) => {
        let [userdetail] = await connection.execute('SELECT * FROM User_Details');
        res.render('userdetail/index', {
            'userdetail': userdetail
        })
    })

    //Create a new user in User_Details Table
    app.get('/userdetail/create', async(req,res)=>{
        let [userdetail] = await connection.execute('SELECT * FROM User_Details');
        res.render('userdetail/create', {
            'userdetail': userdetail
        })
    })

    app.post('/userdetail/create', async function (req, res) {
        // req.body will contain what the user has submitted through the form
        // we are using PREPARED STATEMENTS (to counter SQL injection attacks)
        const sql = `
            INSERT INTO User_Details (typeofUser, fullName, contactNumber, email)
            VALUES (?, ?, ?, ?);`

        const bindings = [
            req.body.typeofUser,
            req.body.fullName,
            req.body.contactNumber,
            req.body.email

        ]

        // first parameter = the SQL statemnet to execute
        // second parameter = bindings, or the parameter for the question marks, in order
        await connection.execute(sql, bindings);

        // redirect tells the client (often time the broswer) to go a different URL
        res.redirect('/userdetail');
    });

    app.listen(3000, ()=>{
        console.log('Server is running')
    });
}

main();