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

    app.get('/userdetail/:userID/edit', async function (req, res) {
        // fetch the User Details we are editing
        const userID = req.params.userID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [userdetail] = await connection.execute(`SELECT * FROM User_Details WHERE userID = ?`, [userId]);

        // MySQL2 will always return an array of results even if there is only one result
       // const userdetail = userdetail[0]; // retrieve the user details that we want to edit which will be at index 0

        // send the userdetail to the hbs file so the user can see details prefilled in the form
        res.render('userdetail/edit', {
            userdetail, // => same as 'userdetail' : userdetail
        })
    })

    app.post('/userdetail/:userID/edit', async function (req, res) {
        try {
            const {typeofUser, fullName, contactNumber, email} = req.body;

           // if (!first_name || !last_name || !company_id || !rating) {
           //     throw new Exception("Invalid values");
           //  }

            const sql = `UPDATE User_Details SET typeofUser=?, fullName=?, contactNumber, email=?,
            WHERE userID = ?;`

            const bindings = [typeofUser, fullName, contactNumber, email, req.params.userID];

            await connection.execute(sql, bindings);

            res.redirect("/userdetail");
        } catch (e) {
            res.status(400).send("Error " + e);
        }
    })
}

main();

app.listen(3000, ()=>{
    console.log('Server is running')
});