const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for expenses
router.get('/add', (req, res) => {
    let session = req.session;
    if (session.userID) {
        res.render('expenses/add');
    } else {
        res.send('please log in')
    }
});

//To learn- why need to JSON stringify and Parse over at ejs
router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.send('please log in');
    } else {
        let sql = `SELECT * FROM expenses WHERE userID = ${session.userID} ORDER BY created_at ASC`;
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
    let data = {
        expensesID: randomNum,
        userID: req.session.userID,
        name: req.body.name,
        amount: req.body.amount,
        category: req.body.category,
        recurring_date: req.body.recurring_date,
        recurring: req.body.recurring == 1 ? 1 : 0
    }

    let sql = "INSERT INTO expenses SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
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
        res.send('please log in');
    } else {
        const userID = session.userID;
        const expensesID = req.params.expensesID;
        let sql = `SELECT * FROM expenses
               WHERE userID = ${userID} AND expensesID = '${expensesID}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result[0])
            res.render('expenses/edit', {
                result: result
            });
        });
    }
});

// UPDATE expenses Query
router.post('/update/:expensesID', (req, res) => {
    let recurring_val = req.body.recurring;
    let data = {
        name: req.body.name,
        category: req.body.category,
        recurring: recurring_val == null? false : true,
        recurring_date: req.body.recurring_date
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
