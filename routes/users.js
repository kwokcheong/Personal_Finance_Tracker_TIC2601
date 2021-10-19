const express = require('express');
const db = require('../db');
const router = express.Router();

/* GET users listing. */
router.post('/auth',(req,res) => {
  let email = req.body.email;
	let password = req.body.password;
  let sql = 'SELECT * FROM users WHERE email=? AND password=?';
  if (email && password){
    session=req.session;
    db.query(sql, [email, password], (err, result) => {
      if (err) throw err;
      if (result.length > 0){
        session=req.session;
        req.session.loggedin = true;
        req.session.userEmail = email;
        req.session.userID = result[0].userID.toString();
        res.redirect('../')
      } else {
        res.redirect('../invalid')
      }
    });
  }
});

router.post('/create', (req, res) => {
  let data = { name: req.body.name, email: req.body.email, password: req.body.password};
  let sql = "INSERT INTO users SET ?";
  db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.redirect('../login')
  })
});

router.get('/show', (req, res) => {
  let sql = `SELECT * FROM users`;
  db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result[0])
  });
});

router.post('/update_password', (req,res) => {
  let email = req.body.email;
  let new_password = req.body.new_password;
  let sql = `UPDATE users SET password=? WHERE users.email = '${email}'`
  let validate_email = `SELECT userID FROM users WHERE users.email = '${email}'`
  db.query(validate_email, (err, result) => {
    if (err) throw err;
    console.log(result[0])
    if (result[0] == null){
      res.render('password', {
        error : 'Email does not exist. Please try again.'
      });
    } else {
      db.query(sql, new_password, (err,result) => {
        if (err) throw err;
        res.redirect('../login');
      })
    }
  })
})

module.exports = router;
