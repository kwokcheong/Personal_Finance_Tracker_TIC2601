const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    const today = new Date();
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM budgets WHERE userID = ${session.userID} ORDER BY created_at ASC;
                   SELECT SUM(amount) AS 'total_exp' from expenses WHERE userID = ${session.userID} GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) DESC LIMIT 1;
                   SELECT SUM(budget_amount_per_month) AS 'total_budget' FROM budgets WHERE userID = ${session.userID};
                   SELECT fn_daysCounter('${today.getFullYear()}', ${today.getMonth()+1}) AS 'days';`
        db.query(sql, (err, result) => {
            if (err) throw err;
            let budgetChart = [];
            let total_expense = result[1][0].total_exp;
            let remaining_budget = parseFloat(result[2][0].total_budget) - parseFloat(result[1][0].total_exp);
            if(remaining_budget < 0){
                remaining_budget = 0.00;
            }
            budgetChart[0] = total_expense;
            budgetChart[1] = remaining_budget;
            console.log(result[3][0].days)
            res.render('budgets/view', {
                result: result[0],
                budgetChart: JSON.stringify(budgetChart),
                daysLeft: result[3][0].days,
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
