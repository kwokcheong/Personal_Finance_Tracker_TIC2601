const express = require('express');
const db = require('../db');
const router = express.Router();

// Home page.
router.get('/', function(req, res) {
  let session = req.session;
  if (!session.userID){
      res.render('welcome');
  } else {
      let sql = `SELECT SUM(amount) 'sum', SUM(amount) / TIMESTAMPDIFF(MONTH, MIN(created_at), MAX(created_at)) 'avg' FROM incomes;
                 SELECT SUM(amount) 'sum', SUM(amount) / TIMESTAMPDIFF(MONTH, MIN(created_at), MAX(created_at)) 'avg' FROM expenses;
                 SELECT current_balance 'bal' FROM ledger WHERE userID = ${session.userID} LIMIT 1`;
      db.query(sql, (err , result) => {
          if (err) throw err;
          let averageIncome = result[0][0].avg;
          let averageExpense = result[0][0].avg;

          if(averageIncome == null){
            averageIncome = result[0][0].sum;
          }
          if(averageExpense == null){
            averageExpense = result[1][0].sum;
          }

          res.render('dashboard', {
              name: session.username,
              averageIncome: averageIncome,
              averageExp: averageExpense,
              averageSaving: averageIncome - averageExpense,
              curr_balance: result[2][0].bal
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
