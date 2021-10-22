const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for income
router.get('/add', (req, res) => {
    let session = req.session;
    if (session.userID){
        res.render('income/add', {
            title: 'This is the create income page, you should make the form here'
        });
    } else {
        res.send('please log in')
    }
});

//To learn- why need to JSON stringify and Parse over at ejs
router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID){
        res.send('please log in');
    } else {
        let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at ASC`;
        let months = ['Jan','Feb', 'March', 'April', 'May', 'June', 'July']; 
        let labeldata = ['food','luxury','Transport','Bills','Others'];
        let amount = [];
        db.query(sql, (err,result) => {
            if (err) throw err;
            for (let i=0; i<result.length; i++){
                amount[i] = result[i].amount;
            }
            res.render('income/view', {
                result: JSON.stringify(result),
                name: session.username,
                data: JSON.stringify(amount),
                labelMonth: JSON.stringify(months),
                label: JSON.stringify(labeldata)
            })
        })
    }
})

router.get('/playground2', (req,res) => {
    let session = req.session;
    if (!session.userID){
        res.send('please log in');
    } else {
        let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at ASC`;
        let months = ['Jan','Feb', 'March', 'April', 'May', 'June', 'July']; 
        let labeldata = ['food','luxury','Transport','Bills','Others'];
        let amount = [];
        db.query(sql, (err,result) => {
            if (err) throw err;
            for (let i=0; i<result.length; i++){
                amount[i] = result[i].amount;
            }
            res.render('income/playground2', {
                result: result,
                name: session.username,
                data: JSON.stringify(amount),
                labelMonth: JSON.stringify(months),
                label: JSON.stringify(labeldata)
            })
        })
    }
})

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
        recurring : req.body.recurring == 1 ? 1 : 0
    }

    let sql = "INSERT INTO incomes SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('../income/view');
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
