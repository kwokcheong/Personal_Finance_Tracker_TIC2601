const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for income
router.get('/add', (req, res) => {
    let session = req.session;
    if (session.userID) {
        res.render('goals/add', {
            title: 'Add Goals'
        });
    } else {
        res.send('please log in')
    }
});

router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.send('please log in');
    } else {
        let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at ASC`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('income/view', {
                result: result,
                name: session.username
            })
        })
    }
})

//INSERT income query
router.post('/save', (req, res) => {
    let randomNum = Math.random().toString(36).substr(2, 8);
    let data = {
        goalID: randomNum,
        userID: req.session.userID,
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        done: 0,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }

    let sql = "INSERT INTO incomes SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// //DELETE income query
// router.get('/delete/:incomeID', (req, res) => {
//     const userID = req.session.userID;
//     const incomeID = req.params.incomeID;
//     let sql = `DELETE FROM incomes WHERE userID = ${userID} AND incomeID = '${incomeID}'`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         res.redirect('/income/view');
//     });
// });

// // Edit PAGE
// router.get('/edit/:incomeID', (req, res) => {
//     let session = req.session;
//     if (!session.userID) {
//         res.send('please log in');
//     } else {
//         const userID = session.userID;
//         const incomeID = req.params.incomeID;
//         let sql = `SELECT * FROM incomes
//                WHERE userID = ${userID} AND incomeID = '${incomeID}'`;
//         db.query(sql, (err, result) => {
//             if (err) throw err;
//             console.log(result[0])
//             res.render('income/edit', {
//                 result: result
//             });
//         });
//     }
// });

// // UPDATE income Query
// router.post('/update/:incomeID', (req, res) => {
//     let recurring_val = req.body.recurring;
//     let data = {
//         name: req.body.name,
//         category: req.body.category,
//         recurring: recurring_val == null? false : true,
//         recurring_date: req.body.recurring_date
//     }
//     let session = req.session;
//     const userID = session.userID;
//     const incomeID = req.params.incomeID;
//     let sql = `UPDATE incomes SET ? WHERE userID = ${userID} AND incomeID = ${incomeID}`
//     db.query(sql, data, (err, result) => {
//         if (err) throw err;
//         res.redirect('/income/view');
//     })
// })

module.exports = router;
