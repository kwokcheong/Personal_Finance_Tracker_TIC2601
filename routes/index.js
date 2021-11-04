const express = require('express');
const db = require('../db');
const router = express.Router();

// Home page.
router.get('/', function(req, res) {
  let session = req.session;
  if (!session.userID){
      res.render('welcome');
  } else {
      let sql = `SELECT SUM(amount) 'sum', SUM(amount) / TIMESTAMPDIFF(MONTH, MIN(created_at), MAX(created_at)) 'avg' FROM incomes WHERE userID = ${session.userID};
                 SELECT SUM(amount) 'sum', SUM(amount) / TIMESTAMPDIFF(MONTH, MIN(created_at), MAX(created_at)) 'avg' FROM expenses WHERE userID = ${session.userID};
                 SELECT current_balance 'bal' FROM ledger WHERE userID = ${session.userID} LIMIT 1;
                 SELECT * FROM v_incomeexpenses WHERE userID = ${session.userID} ORDER BY createdDt DESC;
                 SELECT SUM(amount) 'income_sum' FROM incomes WHERE userID = ${session.userID} GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) DESC LIMIT 6;
                 SELECT SUM(amount) 'exp_sum' FROM expenses WHERE userID = ${session.userID} GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) DESC LIMIT 6;
                 CALL sp_calculateAverageIncomeCategory(${session.userID});`

      let sql2 = ` CALL crud_express.sp_calculateAverageExpensesCategory(${session.userID});`
      db.query(sql, (err , result) => {
          if (err) throw err;
          let averageIncome = result[0][0].avg;
          let averageExpense = result[1][0].avg;
          let curr_bal = result[2][0] != null? result[2][0].bal : 0;
          let moIncomeLabel = [];
          let moIncomeData = [];
          let viewtable = result[3];
          let count = 0;
          let moneyflowIncome = [];
          let moneyflowExpenses = [];


          if(averageIncome == null){
            averageIncome = result[0][0].sum;
          }
          if(averageExpense == null){
            averageExpense = result[1][0].sum;
          }

          for(let i=0; i<result[6].length ; i++){
            moIncomeLabel[i] = result[6][i].category;
            moIncomeData[i] = parseFloat(result[6][i].amount).toFixed(2)
          }

          for(let i=result[4].length-1; i>=0; i--){
            moneyflowIncome[count] = parseFloat(result[4][i].income_sum).toFixed(2);
            count++;
          }
          count = 0;
          for(let i=result[5].length-1; i>=0; i--){
            moneyflowExpenses[count] = parseFloat(result[5][i].exp_sum).toFixed(2);
            count++;
          }
          let moExpenseLabel = [];
          let moExpenseData = [];
          db.query(sql2, (err, result) => {
            if(err) throw err;
            for(let i=0; i<result[0].length ; i++){
              moExpenseLabel[i] = result[0][i].category; 
              moExpenseData[i] = parseFloat(result[0][i].amount).toFixed(2);
            }

            res.render('dashboard', {
              name: session.username,
              averageIncome: averageIncome != null ? averageIncome : 0,
              averageExp: averageExpense != null? averageExpense : 0,
              averageSaving: averageIncome - averageExpense,
              curr_balance: curr_bal,
              result: viewtable,
              incomePieLabel: JSON.stringify(moIncomeLabel),
              incomePie: JSON.stringify(moIncomeData),
              expensePieLabel: JSON.stringify(moExpenseLabel),
              expensePie: JSON.stringify(moExpenseData),
              moneyflow_income: JSON.stringify(moneyflowIncome),
              moneyflow_expenses: JSON.stringify(moneyflowExpenses)
          })
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
