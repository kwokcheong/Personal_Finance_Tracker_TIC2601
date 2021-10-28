const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for income
router.get('/view', (req, res) => {
    let session = req.session;
    let amount= [];
    let categoryData = [];
    let temp = [];
    let max = 0;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at DESC;
        SELECT amount FROM incomes WHERE userID = ${session.userID} AND category = 'Salary' ORDER BY created_at ASC;
        SELECT amount FROM incomes WHERE userID = ${session.userID} AND category = 'Freelance' ORDER BY created_at ASC;
        SELECT amount FROM incomes WHERE userID = ${session.userID} AND category = 'Allowance' ORDER BY created_at ASC;
        SELECT amount FROM incomes WHERE userID = ${session.userID} AND category = 'Others' ORDER BY created_at ASC; `;
        db.query(sql, (err, result) => {
            if (err) throw err;
            //find max
            for (let i=0; i<result[0].length; i++){
                if (parseInt(result[0][i].amount) > max){
                    max = result[0][i].amount;
                }
                amount[i] = result[0][i].amount;
            }
            for(let i=1; i<=4; i++){
                for(let j=0; j<result[i].length; j++){
                    temp.push(parseInt(result[i][j].amount));
                }
                categoryData.push(temp);
                temp = [];
            }
            res.render('income/view', {
                result: result[0],
                categoryAmount: categoryData,
                max_amount: max,
                name: session.username
            })
        })
    }
});

//INSERT income query
router.post('/save', (req, res) => {
    let randomNum = Math.random().toString(36).substr(2, 8);
    let today = new Date().toISOString().split('T')[0];
    let data = {
        incomeID: randomNum,
        userID: req.session.userID,
        name: req.body.name,
        amount: req.body.amount,
        category: req.body.category,
        recurring_start_date: req.body.recurring_start_date == null ? today : req.body.recurring_start_date,
        recurring_end_date: req.body.recurring_end_date == null ? today : req.body.recurring_end_date, 
        recurring: req.body.recurring == 1 ? 1 : 0
    }

    let sql = "INSERT INTO incomes SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/income/view');
    });
});

//DELETE income query
router.get('/delete/:incomeID', (req, res) => {
    const userID = req.session.userID;
    const incomeID = req.params.incomeID;
    let sql = `DELETE FROM incomes WHERE userID = ${userID} AND incomeID = '${incomeID}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/income/view');
    });
});

// Edit PAGE
router.get('/edit/:incomeID', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');
    } else {
        const userID = session.userID;
        const incomeID = req.params.incomeID;
        let sql = `SELECT * FROM incomes
               WHERE userID = ${userID} AND incomeID = '${incomeID}';
               SELECT DATE(recurring_start_date) as 'start_date',
               DATE(recurring_end_date) as 'end_date'
               FROM incomes
               WHERE userID = ${userID} AND incomeID = '${incomeID}';`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('income/edit', {
                result: result[0],
                start_date: result[1][0].start_date.toISOString().split('T')[0],
                end_date: result[1][0].end_date.toISOString().split('T')[0],
                name: session.username
            });
        });
    }
});

// UPDATE income Query
router.post('/update/:incomeID', (req, res) => {
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
    const incomeID = req.params.incomeID;
    let sql = `UPDATE incomes SET ? WHERE userID = ${userID} AND incomeID = ${incomeID}`
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect('/income/view');
    })
})

module.exports = router;
