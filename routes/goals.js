const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/view', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        let sql = `SELECT * FROM goals WHERE userID = ${session.userID} ORDER BY created_at ASC`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('goals/view', {
                result: result,
                name: session.username
            })
        })
    }
})

//INSERT Query
router.post('/save', (req, res) => {
    let randomNum = Math.random().toString(36).substr(2, 8);
    let today = new Date().toISOString().split('T')[0];
    let data = {
        goalID: randomNum,
        userID: req.session.userID,
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        image_url: req.body.image_url == '' ? 'https://image.shutterstock.com/image-photo/stock-photo-duct-taped-banana-on-white-wall-250nw-1584501430.jpg' : req.body.image_url,
        done: 0,
        start_date: req.body.start_date == null ? today : req.body.start_date,
        end_date: req.body.end_date == null ? today : req.body.end_date, 
    }

    let sql = "INSERT INTO goals SET ?";
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/goals/view');
    });
});

//DELETE goal query
router.get('/delete/:goalID', (req, res) => {
    const userID = req.session.userID;
    const goalID = req.params.goalID;
    let sql = `DELETE FROM goals WHERE userID = ${userID} AND goalID = '${goalID}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/goals/view');
    });
});

// Edit PAGE
router.get('/edit/:goalID', (req, res) => {
    let session = req.session;
    if (!session.userID) {
        res.render('loggedout');;
    } else {
        const userID = session.userID;
        const goalID = req.params.goalID;
        let sql = `SELECT * FROM goals
               WHERE userID = ${userID} AND goalID = '${goalID}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result[0])
            res.render('goals/edit', {
                name: session.username,
                result: result
            });
        });
    }
});

// UPDATE goal Query
router.post('/update/:goalID', (req, res) => {
    let today = new Date().toISOString().split('T')[0];
    let data = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        start_date: req.body.start_date == null ? today : req.body.start_date,
        end_date: req.body.end_date == null ? today : req.body.end_date, 
    }
    let session = req.session;
    const userID = session.userID;
    const goalID = req.params.goalID;
    let sql = `UPDATE goals SET ? WHERE userID = ${userID} AND goalID = ${goalID}`
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect('/goals/view');
    })
})

module.exports = router;
