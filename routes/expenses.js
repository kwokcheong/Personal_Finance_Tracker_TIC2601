const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/add', (req, res) => {
    let session = req.session;
    if (session.userID){
        res.render('expenses/add', {
            title: 'This is the create expenses page, you should make the form here'
        });
    } else {
        res.send('please log in')
    }
});

router.post('/save', (req , res) => {
    let randomNum = Math.random().toString(36).substr(2,8);
    let data = {
        expensesID : randomNum,
        userID : req.session.userID,
        name : req.body.name,
        amount : req.body.amount,
        category : req.body.category,
        recurring_date : req.body.recurring_date,
        recurring : req.body.recurring == 1 ? 1 : 0
    }

    let sql = "INSERT INTO expenses SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('../expenses/view');
    });
});

router.get('/view', (req, res) => {
    let session = req.session;
    if (session.userID){
        res.render('expenses/view',);
    } else {
        res.send('please log in')
    }
});


module.exports = router;