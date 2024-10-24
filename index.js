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

    //Display the Property_Details Table Data
    app.get('/propertydetail', async (req, res) => {
        let [propertydetail] = await connection.execute('SELECT * FROM Property_Details');
        res.render('propertydetail/index', {
            'propertydetail': propertydetail
        })
    })
    //Display the Tenancy_Details Table Data
    app.get('/tenancydetail', async (req, res) => {
        let [tenancydetail] = await connection.execute('SELECT * FROM Tenancy_Details');
        res.render('tenancydetail/index', {
            'tenancydetail': tenancydetail
        })
    })

    //Display the Payments Table Data
    app.get('/payment', async (req, res) => {
        let [payment] = await connection.execute('SELECT * FROM Payments');
        res.render('payment/index', {
            'payment': payment
        })
    })

    //Display the Issues Table Data
    app.get('/issue', async (req, res) => {
        let [issue] = await connection.execute('SELECT * FROM Issues');
        res.render('issue/index', {
            'issue': issue
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

    //Create a new user in Property_Details Table
    app.get('/propertydetail/create', async(req,res)=>{
        let [propertydetail] = await connection.execute('SELECT * FROM Property_Details');
        res.render('propertydetail/create', {
            'propertydetail': propertydetail
        })
    })

    app.post('/propertydetail/create', async function (req, res) {
        // req.body will contain what the user has submitted through the form
        // we are using PREPARED STATEMENTS (to counter SQL injection attacks)
        const sql = `
            INSERT INTO Property_Details (nameofProperty, address, postalCode, numberofBedrooms,
             numberofBathrooms, carparkLots, amenities, askingBaseRent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

        const bindings = [
            req.body.nameofProperty,
            req.body.address,
            req.body.postalCode,
            req.body.numberofBedrooms,
            req.body.numberofBathrooms,
            req.body.carparkLots,
            req.body.amenities,
            req.body.askingBaseRent

        ]

        // first parameter = the SQL statemnet to execute
        // second parameter = bindings, or the parameter for the question marks, in order
        await connection.execute(sql, bindings);

        // redirect tells the client (often time the broswer) to go a different URL
        res.redirect('/propertydetail');
    });

    //Create a new user in Tenancy_Details Table
    app.get('/tenancydetail/create', async(req,res)=>{
            let [tenancydetail] = await connection.execute('SELECT * FROM Tenancy_Details');
            res.render('tenancydetail/create', {
                'tenancydetail': tenancydetail
            })
        })
    
    app.post('/tenancydetail/create', async function (req, res) {
            // req.body will contain what the user has submitted through the form
            // we are using PREPARED STATEMENTS (to counter SQL injection attacks)
            const sql = `
                INSERT INTO Tenancy_Details (dateStarted, durationofTenancy, baserentalAmount, depositAmount,
                 subtenantsFullName, propertyID, userID)
                VALUES (?, ?, ?, ?, ?, ?, ?);`
    
            const bindings = [
                req.body.dateStarted,
                req.body.durationofTenancy,
                req.body.baserentalAmount,
                req.body.depositAmount,
                req.body.subtenantsFullName,
                req.body.propertyID,
                req.body.userID
    
            ]
    
            // first parameter = the SQL statemnet to execute
            // second parameter = bindings, or the parameter for the question marks, in order
            await connection.execute(sql, bindings);
    
            // redirect tells the client (often time the broswer) to go a different URL
            res.redirect('/tenancydetail');
        });

    //Create a new user in Payments Table
    app.get('/payment/create', async(req,res)=>{
        let [payment] = await connection.execute('SELECT * FROM Payments');
        res.render('payment/create', {
            'payment': payment
        })
    })

    app.post('/payment/create', async function (req, res) {
        // req.body will contain what the user has submitted through the form
        // we are using PREPARED STATEMENTS (to counter SQL injection attacks)
        const sql = `
            INSERT INTO Payments (typeofPayment, datePaid, receiverName, paymentInvoiceNumber,
             remarks, userID, tenancyID)
            VALUES (?, ?, ?, ?, ?, ?, ?);`

        const bindings = [
            req.body.typeofPayment,
            req.body.datePaid,
            req.body.receiverName,
            req.body.paymentInvoiceNumber,
            req.body.remarks,
            req.body.userID,
            req.body.tenancyID

        ]

        // first parameter = the SQL statemnet to execute
        // second parameter = bindings, or the parameter for the question marks, in order
        await connection.execute(sql, bindings);

        // redirect tells the client (often time the broswer) to go a different URL
        res.redirect('/payment');
    });

    //Edit User Details
    app.get('/userdetail/:userID/edit', async function (req, res) {
        // fetch the User Details we are editing
        const userId = req.params.userID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [userdetail] = await connection.execute(`SELECT * FROM User_Details WHERE userID = ?`, [userId]);

        // MySQL2 will always return an array of results even if there is only one result
        const userdetail1 = userdetail[0]; // retrieve the user details that we want to edit which will be at index 0

        // send the userdetail to the hbs file so the user can see details prefilled in the form
        res.render('userdetail/edit', {
            userdetail1, // => same as 'userdetail' : userdetail
        })
    })

    app.post('/userdetail/:userID/edit', async function (req, res) {
        
            const { typeofUser, fullName, contactNumber, email } = req.body;

           // if (!first_name || !last_name || !company_id || !rating) {
           //     throw new Exception("Invalid values");
           //  }

            const sql = `UPDATE User_Details SET typeofUser=?, fullName=?, contactNumber=?, email=? WHERE userID = ?;`

            const bindings = [typeofUser, fullName, contactNumber, email, req.params.userID];

            await connection.execute(sql, bindings);

            res.redirect("/userdetail");
    })
        
    app.get('/userdetail/:userID/delete', async function(req,res){
                // display a confirmation form 
                const [userdetail] = await connection.execute(
                    "SELECT * FROM User_Details WHERE userID =?", [req.params.userID]
                );
                const userId = userdetail[0];
        
                res.render('userdetail/delete', {
                    userId
                })
    })

    app.post('/userdetail/:userID/delete', async function(req, res){
        await connection.execute(`DELETE FROM User_Details WHERE userID = ?`, [req.params.userID]);
        res.redirect('/userdetail');
    })
}

main();

app.listen(3000, ()=>{
    console.log('Server is running')
});