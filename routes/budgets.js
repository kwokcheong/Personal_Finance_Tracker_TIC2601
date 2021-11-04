const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM budgets WHERE userID = ${session.userID} ORDER BY created_at ASC;
                   SELECT SUM(amount) from expenses WHERE userID = ${session.userID} `;
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('budgets/view', {
                result: result,
                name: session.username
            })
        })
    }
})

// Edit PAGE
router.get('/edit/:budgetcategory', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        const userID = session.userID;
        const budgetcategory = req.params.budgetcategory;
        let sql = `SELECT * FROM budgets
               WHERE userID = ${userID} AND category = '${budgetcategory}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result[0])
            res.render('budgets/edit', {
                result: result,
                name: session.username
            });
        });
    }
});

// UPDATE budgets Query
router.post('/update/:budgetcategory', (req, res) => {
    let data = {
        budget_amount_per_month: req.body.amount
    }
    let session = req.session;
    const userID = session.userID;
    const budgetcategory = req.params.budgetcategory;
    let sql = `UPDATE budgets SET ? WHERE userID = ${userID} AND category = '${budgetcategory}'`
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect('/budgets/view');
    })
})

module.exports = router;
