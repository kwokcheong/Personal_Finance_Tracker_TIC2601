const express = require('express');
const router = express.Router();

// a variable to save a session
var session;

/* GET home page. */
router.get('/', function(req, res) {
  session=req.session;
  // console.log(session.userid)
  if(session.userid){
      res.render('index')
  }else
  res.render('welcome');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/expenses', function(req, res) {
  res.render('expenses')
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/invalid', function(req, res) {
  res.send('Invalid User');
});

module.exports = router;
