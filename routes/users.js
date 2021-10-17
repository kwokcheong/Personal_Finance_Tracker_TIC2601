const express = require('express');
const { request, response } = require('../app');
const db = require('../db');
const router = express.Router();

/* GET users listing. */
router.post('/auth',(req,res) => {
  let username = req.body.username;
	let password = req.body.password;
  let sql = 'SELECT * FROM users WHERE email=? AND password=?';
  if (username && password){
    db.query(sql, [username, password], (err, result) => {
      if (err) throw err;
      if (result.length > 0){
        session=req.session;
        req.session.loggedin = true;
        req.session.userEmail = username;
        req.session.userid = result[0].id.toString();
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

module.exports = router;
