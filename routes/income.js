const express = require('express');
const db = require('../db');
const router = express.Router();


// form page for income
router.get('/view', (req, res) => {
    let session = req.session;
    let amount= [0,0,0,0,0,0];
    let max = 0;
    let salary = [0,0,0,0,0,0];
    let freelance = [0,0,0,0,0,0];
    let allowance = [0,0,0,0,0,0];
    let others = [0,0,0,0,0,0];
    
    function insertCategory(result,x,y){
        if(result[x].category == 'Freelance'){freelance[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Salary'){salary[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Allowance'){allowance[y] = parseFloat(result[x].amount);}
        if(result[x].category == 'Others'){others[y] = parseFloat(result[x].amount);}
    }

    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at DESC;
                    call crud_express.sp_calculateIncomePerMonth(1, ${session.userID});
                    `;
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
            let a = Math.max(...freelance);
            let b = Math.max(...allowance);
            let c = Math.max(...salary);
            let d = Math.max(...others);
            max = Math.max(a,b,c,d);

            for(let i=0; i<=5; i++){
                amount[i] = freelance[i] + allowance[i] + salary[i] + others[i];
            }
            
            console.log(result[1])
            res.render('income/view', {
                result: result[0],
                freelance: JSON.stringify(freelance),
                allowance: JSON.stringify(allowance),     
                salary: JSON.stringify(salary),
                others: JSON.stringify(others),           
                max_amount: max,
                baramount: JSON.stringify(amount),
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
