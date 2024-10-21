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
        res.render('userdetail/add', {
            'userdetail': userdetail
        })
    })

    app.listen(3000, ()=>{
        console.log('Server is running')
    });
}

main();