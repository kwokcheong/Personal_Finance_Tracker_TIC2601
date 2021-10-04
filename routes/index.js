const express = require('express');
const router = express.Router();

// a variable to save a session
var session;

/* GET home page. */
router.get('/', function(req, res) {
  session=req.session;
  // console.log(session.userid)
  if(session.userid){
      res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  }else
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
