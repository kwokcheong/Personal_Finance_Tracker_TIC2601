const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    let curr = 0.0;
    let amount= [0,0,0,0,0,0];
    let Bills = [0,0,0,0,0,0];
    let Food = [0,0,0,0,0,0];
    let Luxury = [0,0,0,0,0,0];
    let Transport = [0,0,0,0,0,0];
    let Utility = [0,0,0,0,0,0];
    let Others = [0,0,0,0,0,0];

    function insertCategory(result,x,y){
        let categories = ['Bills', 'Food', 'Luxury', 'Transport', 'Utility', 'Others'];
        if(result[x].category == 'Bills'){Bills[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Food'){Food[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Luxury'){Luxury[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Transport'){Transport[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Utility'){Utility[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Others'){Others[y] = parseFloat(result[x].amount);}
    }


    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM expenses WHERE userID = ${session.userID} ORDER BY created_at DESC;
        call crud_express.sp_calculateExpensesPerMonth(1, '1');`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            for(let i=0 ; i<result[1].length; i++){
                switch(result[1][i].record_month){
                    case 6 : insertCategory(result[1],i,0);
                        break;
                    case 7 : insertCategory(result[1],i,1);
                        break;
                    case 8 : insertCategory(result[1],i,2);
                        break;
                    case 9 : insertCategory(result[1],i,3);
                        break;
                    case 10 : insertCategory(result[1],i,4);
                        break;
                    case 11: insertCategory(result[1],i,5);
                        break;
                }
            }

            for(let i=0; i<=5; i++){
                curr = Food[i] + Bills[i] + Luxury[i] + Transport[i] + Utility[i] + Others[i];
                amount[i] = curr.toFixed(2);
                curr = 0.0;
            }

            res.render('expenses/view', {
                result: result[0],
                Bills: JSON.stringify(Bills),
                Food: JSON.stringify(Food),     
                Luxury: JSON.stringify(Luxury),
                Others: JSON.stringify(Others),
                Utility: JSON.stringify(Utility),
                Transport: JSON.stringify(Transport),
                total_per_month: JSON.stringify(amount),
                name: session.username
            })
        })
    }
})

//INSERT expenses query
router.post('/save', (req, res) => {
    let today = new Date().toISOString().split('T')[0];
    let data = {
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