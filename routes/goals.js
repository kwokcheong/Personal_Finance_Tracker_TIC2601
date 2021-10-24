const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for goal
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
        res.send('please log in');
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
    let data = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        start_date: req.body.start_date,
        end_date: req.body.end_date
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
