const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    const today = new Date();
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM budgets WHERE userID = ${session.userID} ORDER BY category ASC;
                   SELECT SUM(amount) AS 'total_exp' from expenses WHERE userID = ${session.userID} AND MONTH(created_at) = MONTH(CURRENT_TIMESTAMP) AND YEAR(created_at) = YEAR(CURRENT_TIMESTAMP);
                   SELECT SUM(budget_amount_per_month) AS 'total_budget' FROM budgets WHERE userID = ${session.userID};
                   SELECT fn_daysCounter('${today.getFullYear()}', ${today.getMonth()+1}) AS 'days';
                   SELECT category, SUM(amount) 'sum' FROM crud_express.expenses WHERE userID = ${session.userID} AND MONTH(created_at) = MONTH(CURRENT_TIMESTAMP) AND YEAR(created_at) = YEAR(CURRENT_TIMESTAMP) GROUP BY category ORDER BY category ASC;`
        db.query(sql, (err, result) => {
            if (err) throw err;
            let budgetLabel = [];
            let budgetChart = [];
            let expensesByCat = ['0','0','0','0','0','0'];
            let total_expense = result[1][0].total_exp;
            let remaining_budget = parseFloat(result[2][0].total_budget) - parseFloat(result[1][0].total_exp);
            if(remaining_budget < 0){
                remaining_budget = 0.00;
            }
            budgetChart[0] = total_expense;
            budgetChart[1] = remaining_budget;

            let budgetByCategory = [];
            for (let i=0; i<result[0].length; i++){
                budgetLabel[i] = result[0][i].category;
                budgetByCategory[i] = result[0][i].budget_amount_per_month;
            }

            for(let i=0; i<result[4].length; i++){
                switch(result[4][i].category){
                    case 'Bills': expensesByCat[0] = result[4][i].sum; break;
                    case 'Food': expensesByCat[1] = result[4][i].sum; break;
                    case 'Luxury': expensesByCat[2] = result[4][i].sum; break;
                    case 'Others': expensesByCat[3] = result[4][i].sum; break;
                    case 'Transport': expensesByCat[4] = result[4][i].sum; break;
                    case 'Utility': expensesByCat[5] = result[4][i].sum; break;
                    default: break;
                }
            }
            

            res.render('budgets/view', {
                result: result[0],
                budgetChart: JSON.stringify(budgetChart),
                daysLeft: result[3][0].days,
                budgetLabel: JSON.stringify(budgetLabel),
                budgetByCategory: JSON.stringify(budgetByCategory),
                expensesByCat: JSON.stringify(expensesByCat),
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
