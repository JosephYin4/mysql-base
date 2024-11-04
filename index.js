const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');
const path = require('path');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
//app.use(express.static('img'));
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

    app.get('/', async (req,res) => {
        res.send('Welcome to HomeRentCare Rental Management System');
          });

    //Display the Dashboard for selecting different Views
    app.get('/dashboard', async (req, res) => {
        //let [dashboard] = await connection.execute('SELECT * FROM User_Details');
        res.render('dashboard/index', {
                //'dashboard': dashboard
        })
    });

    //Display the Search Tables Form for Querying
    app.get('/search', async (req, res) => {
         let [search] = await connection.execute(`SELECT User_Details.userID AS User_Details_userID, User_Details.typeofUser, User_Details.fullName, Tenancy_Details.userID AS Tenancy_Details_userID, DATE_FORMAT(Tenancy_Details.dateStarted, '%d-%m-%Y') AS date_started, nameofProperty, address, postalCode FROM Tenancy_Details LEFT JOIN User_Details ON Tenancy_Details.userID=User_Details.userID LEFT JOIN Property_Details ON Tenancy_Details.propertyID=Property_Details.propertyID;`);
        res.render('search/index', {
                'search': search
        })
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
        let [tenancydetail] = await connection.execute(`SELECT *, DATE_FORMAT(Tenancy_Details.dateStarted, 
            '%d-%m-%Y') AS date_started FROM Tenancy_Details`);
        res.render('tenancydetail/index', {
            'tenancydetail': tenancydetail
        })
    })

    //Display the Payments Table Data
    app.get('/payment', async (req, res) => {
        let [payment] = await connection.execute(`SELECT *, DATE_FORMAT(Payments.datePaid, '%d-%m-%Y')
             AS date_paid FROM Payments`);
        res.render('payment/index', {
            'payment': payment
        })
    })

    //Display the Issues Table Data
    app.get('/issue', async (req, res) => {
        let [issue] = await connection.execute(`SELECT *, DATE_FORMAT(Issues.dateOpen, '%d-%m-%Y') 
            AS open_date,DATE_FORMAT(Issues.dateClosed, '%d-%m-%Y') 
            AS close_date FROM Issues`);
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
            INSERT INTO Payments (typeofPayment, datePaid, amountPaid, receiverName, paymentInvoiceNumber,
             remarks, userID, tenancyID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

        const bindings = [
            req.body.typeofPayment,
            req.body.datePaid,
            req.body.amountPaid,
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

    //Create a new user in Issues Table
    app.get('/issue/create', async(req,res)=>{
        let [issue] = await connection.execute('SELECT * FROM Issues');
        res.render('issue/create', {
            'issue': issue
        })
    })

    app.post('/issue/create', async function (req, res) {
        // req.body will contain what the user has submitted through the form
        // we are using PREPARED STATEMENTS (to counter SQL injection attacks)
        const sql = `
            INSERT INTO Issues (typeofIssue, locationofIssue, issuedescriptionDetails, dateOpen, dateClosed, 
            issuestatusRemarks, issuecurrentStatus, issueSubmittedByID, issueResolvedByID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`

        const bindings = [
            req.body.typeofIssue,
            req.body.locationofIssue,
            req.body.issuedescriptionDetails,
            req.body.dateOpen,
            req.body.dateClosed || null,
            req.body.issuestatusRemarks,
            req.body.issuecurrentStatus,
            req.body.issueSubmittedByID,
            req.body.issueResolvedByID || null

        ]

        // first parameter = the SQL statemnet to execute
        // second parameter = bindings, or the parameter for the question marks, in order
        await connection.execute(sql, bindings);

        // redirect tells the client (often time the broswer) to go a different URL
        res.redirect('/issue');
    });

    //Edit Functions
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
    
    //Edit Property Details
    app.get('/propertydetail/:propertyID/edit', async function (req, res) {
        // fetch the Property Details we are editing
        const propertyId = req.params.propertyID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [propertydetail] = await connection.execute(`SELECT * FROM Property_Details WHERE propertyID = ?`, [propertyId]);

        // MySQL2 will always return an array of results even if there is only one result
        const propertydetail1 = propertydetail[0]; // retrieve the property details that we want to edit which will be at index 0

        // send the propertydetail to the hbs file so the user can see details prefilled in the form
        res.render('propertydetail/edit', {
            propertydetail1, // => same as 'propertydetail' : propertydetail
        })
    })

    app.post('/propertydetail/:propertyID/edit', async function (req, res) {
        
            const { nameofProperty, address, postalCode, numberofBedrooms, numberofBathrooms,
                carparkLots, amenities, askingBaseRent } = req.body;

           // if (!first_name || !last_name || !company_id || !rating) {
           //     throw new Exception("Invalid values");
           //  }

            const sql = `UPDATE Property_Details SET nameofProperty=?, address=?, postalCode=?, numberofBedrooms=?,
             numberofBathrooms=?, carparkLots=?, amenities=?, askingBaseRent=? WHERE propertyID = ?;`

            const bindings = [nameofProperty, address, postalCode, numberofBedrooms, numberofBathrooms, 
                carparkLots, amenities, askingBaseRent, req.params.propertyID];

            await connection.execute(sql, bindings);

            res.redirect("/propertydetail");
    })

    //Edit Tenancy Details
    app.get('/tenancydetail/:tenancyID/edit', async function (req, res) {
        // fetch the Tenancy Details we are editing
        const tenancyId = req.params.tenancyID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [tenancydetail] = await connection.execute(`SELECT * FROM Tenancy_Details WHERE tenancyID = ?`, [tenancyId]);

        // MySQL2 will always return an array of results even if there is only one result
        const tenancydetail1 = tenancydetail[0]; // retrieve the tenancy details that we want to edit which will be at index 0

        // send the tenancydetail to the hbs file so the user can see details prefilled in the form
        res.render('tenancydetail/edit', {
            tenancydetail1, // => same as 'tenancydetail' : tenancydetail
        })
    })

    app.post('/tenancydetail/:tenancyID/edit', async function (req, res) {
        
            const { dateStarted, durationofTenancy, baserentalAmount, depositAmount, subtenantsFullName,
                propertyID, userID } = req.body;

           // if (!first_name || !last_name || !company_id || !rating) {
           //     throw new Exception("Invalid values");
           //  }

            const sql = `UPDATE Tenancy_Details SET dateStarted=?, durationofTenancy=?, baserentalAmount=?, depositAmount=?,
             subtenantsFullName=?, propertyID=?, userID=? WHERE tenancyID = ?;`

            const bindings = [dateStarted, durationofTenancy, baserentalAmount, depositAmount, subtenantsFullName,
                propertyID, userID, req.params.tenancyID];

            await connection.execute(sql, bindings);

            res.redirect("/tenancydetail");
    })

    //Edit Payment
    app.get('/payment/:paymentID/edit', async function (req, res) {
        // fetch the Payment Details we are editing
        const paymentId = req.params.paymentID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [payment] = await connection.execute(`SELECT * FROM Payments WHERE paymentID = ?`, [paymentId]);

        // MySQL2 will always return an array of results even if there is only one result
        const payment1 = payment[0]; // retrieve the tenancy details that we want to edit which will be at index 0

        // send the payment to the hbs file so the user can see details prefilled in the form
        res.render('payment/edit', {
            payment1, // => same as 'payment' : payment
        })
    })

    app.post('/payment/:paymentID/edit', async function (req, res) {
        
            const { typeofPayment, datePaid, amountPaid, receiverName, paymentInvoiceNumber, remarks,
                userID, tenancyID } = req.body;

           // if (!first_name || !last_name || !company_id || !rating) {
           //     throw new Exception("Invalid values");
           //  }

            const sql = `UPDATE Payments SET typeofPayment=?, datePaid=?, amountPaid=?, receiverName=?, paymentInvoiceNumber=?,
             remarks=?, userID=?, tenancyID=? WHERE paymentID = ?;`

            const bindings = [typeofPayment, datePaid, amountPaid, receiverName, paymentInvoiceNumber, remarks,
                userID, tenancyID, req.params.paymentID];

            await connection.execute(sql, bindings);

            res.redirect("/payment");
    })

    //Edit Issue
    app.get('/issue/:issueID/edit', async function (req, res) {
        // fetch the Issue Details we are editing
        const issueId = req.params.issueID;
        // in prepared statements, we give the instructions to MySQL in 2 pass
        // 1. the prepared statement - so SQL knows what we are executing and won't execute anything else
        // 2. send what is the data for each ?
        // Do you ESCAPE your MySQL statements
        const [issue] = await connection.execute(`SELECT * FROM Issues WHERE issueID = ?`, [issueId]);

        // MySQL2 will always return an array of results even if there is only one result
        const issue1 = issue[0]; // retrieve the issue details that we want to edit which will be at index 0

        // send the issue to the hbs file so the user can see details prefilled in the form
        res.render('issue/edit', {
            issue1, // => same as 'issue' : issue
        })
    })

    app.post('/issue/:issueID/edit', async function (req, res) {
        
            const { typeofIssue, locationofIssue, issuedescriptionDetails, dateOpen,
                dateClosed, issuestatusRemarks, issuecurrentStatus, issueSubmittedByID, issueResolvedByID } = req.body;

            const sql = `UPDATE Issues SET typeofIssue=?, locationofIssue=?, issuedescriptionDetails=?, 
            dateOpen=?, dateClosed=?, issuestatusRemarks=?, issuecurrentStatus=?, issueSubmittedByID=?, issueResolvedByID=? WHERE issueID = ?;`

            const bindings = [typeofIssue, locationofIssue, issuedescriptionDetails, dateOpen,
                dateClosed || null, issuestatusRemarks, issuecurrentStatus, issueSubmittedByID, issueResolvedByID, req.params.issueID];

            await connection.execute(sql, bindings);

            res.redirect("/issue");
    })

    //Delete Functions
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

    app.get('/tenancydetail/:tenancyID/delete', async function(req,res){
        // display a confirmation form 
        const [tenancydetail] = await connection.execute(
            "SELECT * FROM Tenancy_Details WHERE tenancyID =?", [req.params.tenancyID]
        );
        const tenancyId = tenancydetail[0];

        res.render('tenancydetail/delete', {
            tenancyId
        })  
    })

    app.post('/tenancydetail/:tenancyID/delete', async function(req, res){
        await connection.execute(`DELETE FROM Tenancy_Details WHERE tenancyID = ?`, [req.params.tenancyID]);
        res.redirect('/tenancydetail');
    })

    app.get('/propertydetail/:propertyID/delete', async function(req,res){
        // display a confirmation form 
        const [propertydetail] = await connection.execute(
            "SELECT * FROM Property_Details WHERE propertyID =?", [req.params.propertyID]
        );
        const propertyId = propertydetail[0];

        res.render('propertydetail/delete', {
            propertyId
        })
    })

    app.post('/propertydetail/:propertyID/delete', async function(req, res){
        await connection.execute(`DELETE FROM Property_Details WHERE propertyID = ?`, [req.params.propertyID]);
        res.redirect('/propertydetail');
    })

    app.get('/payment/:paymentID/delete', async function(req,res){
        // display a confirmation form 
        const [payment] = await connection.execute(
            "SELECT * FROM Payments WHERE paymentID =?", [req.params.paymentID]
        );
        const paymentId = payment[0];

        res.render('payment/delete', {
            paymentId
        })
    })

    app.post('/payment/:paymentID/delete', async function(req, res){
        await connection.execute(`DELETE FROM Payments WHERE paymentID = ?`, [req.params.paymentID]);
        res.redirect('/payment');
    })

    app.get('/issue/:issueID/delete', async function(req,res){
        // display a confirmation form 
        const [issue] = await connection.execute(
            "SELECT * FROM Issues WHERE issueID =?", [req.params.issueID]
        );
        const issueId = issue[0];

        res.render('issue/delete', {
            issueId
        })
    })

    app.post('/issue/:issueID/delete', async function(req, res){
        await connection.execute(`DELETE FROM Issues WHERE issueID = ?`, [req.params.issueID]);
        res.redirect('/issue');
    })
}


main();

app.listen(3000, ()=>{
    console.log('Server is running')
});