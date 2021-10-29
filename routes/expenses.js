const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM expenses WHERE userID = ${session.userID} ORDER BY created_at DESC`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('expenses/view', {
                result: result,
                name: session.username
            })
        })
    }
})

//INSERT expenses query
router.post('/save', (req, res) => {
    let randomNum = Math.random().toString(36).substr(2, 8);
    let today = new Date().toISOString().split('T')[0];
    let data = {
        expensesID: randomNum,
        userID: req.session.userID,
        name: req.body.name,
        amount: req.body.amount,
        category: req.body.category,
        recurring_start_date: req.body.recurring_start_date == null ? today : req.body.recurring_start_date,
        recurring_end_date: req.body.recurring_end_date == null ? today : req.body.recurring_end_date, 
        recurring: req.body.recurring == 1 ? 1 : 0
    }

    let sql = "INSERT INTO expenses SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/expenses/view');
    });
});

//DELETE expenses query
router.get('/delete/:expensesID', (req, res) => {
    const userID = req.session.userID;
    const expensesID = req.params.expensesID;
    let sql = `DELETE FROM expenses WHERE userID = ${userID} AND expensesID = '${expensesID}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/expenses/view');
    });
});

// Edit PAGE
router.get('/edit/:expensesID', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        const userID = session.userID;
        const expensesID = req.params.expensesID;
        let sql = `SELECT * FROM expenses
               WHERE userID = ${userID} AND expensesID = '${expensesID}';
               SELECT DATE(recurring_start_date) as 'start_date',
               DATE(recurring_end_date) as 'end_date'
               FROM expenses
               WHERE userID = ${userID} AND expensesID = '${expensesID}';`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result[0])
            res.render('expenses/edit', {
                result: result[0],
                start_date: result[1][0].start_date.toISOString().split('T')[0],
                end_date: result[1][0].end_date.toISOString().split('T')[0],
                name: session.username
            });
        });
    }
});

// UPDATE expenses Query
router.post('/update/:expensesID', (req, res) => {
    let today = new Date().toISOString().split('T')[0];
    let data = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        recurring: req.body.recurring == 1 ? 1 : 0,
        recurring_start_date: req.body.recurring_start_date == null ? today : req.body.recurring_start_date,
        recurring_end_date: req.body.recurring_end_date == null ? today : req.body.recurring_end_date, 
    }
    let session = req.session;
    const userID = session.userID;
    const expensesID = req.params.expensesID;
    let sql = `UPDATE expenses SET ? WHERE userID = ${userID} AND expensesID = ${expensesID}`
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect('/expenses/view');
    })
})

module.exports = router;