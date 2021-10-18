const express = require('express');
const { session } = require('passport');
const db = require('../db');
const router = express.Router();


// form page for income
router.get('/add', (req, res) => {
    let session = req.session;
    if (session.userID){
        res.render('income/add', {
            title: 'This is the create income page, you should make the form here',
        });
    } else {
        res.send('please log in')
    }
});

//interim insert query
router.post('/save', (req , res) => {
    let randomNum = Math.random().toString(36).substr(2,8);
    let data = {
        incomeID : randomNum,
        userID : req.session.userID,
        name : req.body.name,
        amount : req.body.amount,
        category : req.body.category,
        recurring_date : req.body.recurring_date,
        recurring : req.body.recurring
    }

    let sql = "INSERT INTO incomes SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('../');
    });
});

// //interim delete query
// router.get('/delete/:incomeID', (req,res) => {
//     const userID = req.params.userId;
//     let sql = `DELETE FROM users WHERE id = ${userID}`;
//     connection.query(sql, (err, result) => {
//         if (err) throw err;
//         res.redirect('../');
//     });
// });

// // Edit page
// router.get('/edit/:userID', (req, res) => {
//     const userID = req.params.userId;
//     let sql = `SELECT * FROM users
//                WHERE users.id = ${userID}`;
//     connection.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result[0])
//         res.render('user_edit', {
//             title: 'This is edit user page',
//             user: result[0]
//         });
//     });
// });

// // interim update query
// router.post('/update', (req, res) => {
//     let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no}
//     let userId = req.body.id;
//     let sql = `UPDATE users SET ? WHERE users.id = ${userId}`
//     connection.query(sql, data, (err, result) => {
//         if (err) throw err;
//         res.redirect('../');
//     })
// })

module.exports = router;
