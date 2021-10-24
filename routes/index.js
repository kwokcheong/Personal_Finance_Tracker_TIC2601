const express = require('express');
const db = require('../db');
const router = express.Router();

// Home page.
router.get('/', function(req, res) {
  let session = req.session;
  if (!session.userID){
      res.render('welcome');
  } else {
      let sql = `SELECT * FROM incomes WHERE userID = ${session.userID} ORDER BY created_at ASC`;
      let months = ['Jan','Feb', 'March', 'April', 'May', 'June', 'July', 'August']; 
      let labeldata = ['food','luxury','Transport','Bills','Others'];
      let amount = [];
      let max = 0;
      db.query(sql, (err,result) => {
          if (err) throw err;
          for (let i=0; i<result.length; i++){
              if (parseInt(result[i].amount) > max){
                  max = result[i].amount;
              }
              amount[i] = result[i].amount;
          }
          res.render('./playground2', {
              result: result,
              max_amount: max,
              name: session.username,
              data: JSON.stringify(amount),
              labelMonth: JSON.stringify(months),
              label: JSON.stringify(labeldata)
          })
      })
  }
})

// Login Page
router.get('/login', function(req, res) {
  res.render('login', {
    error : ''
  });
});

// Forgot Password Page
router.get('/password', function(req, res) {
  res.render('password', {
    error : ' '
  });
});

// Logout Page
router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('login');
});

router.get('/invalid', function(req, res) {
  res.send('Invalid User');
});

module.exports = router;
