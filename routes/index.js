const express = require('express');
const router = express.Router();

// a variable to save a session
var session;

// Home page.
router.get('/', function(req, res) {
  session=req.session;
  if(session.userID){
      res.render('index');
  }else
  res.render('welcome');
});

// Login Page
router.get('/login', function(req, res) {
  res.render('login');
});

// Forgot Password Page
router.get('/password', function(req, res) {
  res.render('password', {
    error : ''
  });
});

// Logout Page
router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/invalid', function(req, res) {
  res.send('Invalid User');
});

module.exports = router;
