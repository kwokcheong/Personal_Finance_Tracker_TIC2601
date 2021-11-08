-- Money insight page
-- Doughnut chart
-- Total expenses --> doughnutDatapoints[0]: 
-- Change '2021' to the user input year and '09' to the user input month
-- Change userID = 1 to the session's user id
SELECT SUM(amount) AS totalExpense FROM expenses
WHERE STR_TO_DATE(CONCAT('2021', '/', '09', '/01'), '%Y/%m/%d') BETWEEN 
recurring_start_date AND recurring_end_date AND userID = 1;

-- Total Budget --> doughnutDatapoints[1]: 
-- Change '2021' to the user input year and '09' to the user input month
-- Change userID = 1 to the session's user id
SELECT IF (( SELECT SUM(budget_amount_per_month) FROM budgets
WHERE userID = 1) <=  ( SELECT SUM(amount) AS totalExpense FROM expenses
WHERE STR_TO_DATE(CONCAT('2021', '/', '09', '/01'), '%Y/%m/%d') BETWEEN 
recurring_start_date AND recurring_end_date AND userID = 1), 0,(SELECT SUM(budget_amount_per_month) FROM budgets
WHERE userID = 1)- (
SELECT SUM(amount) AS totalExpense FROM expenses
WHERE STR_TO_DATE(CONCAT('2021', '/', '09', '/01'), '%Y/%m/%d') BETWEEN 
recurring_start_date AND recurring_end_date AND userID = 1)) AS remainingAllowanceAvailable;

-- Bar chart
-- Spent --> Green bar
-- Change '2021' to the user input year and '09' to the user input month
-- Change userID = 1 to the session's user id
SELECT category, SUM(amount) AS totalExpense FROM expenses
WHERE STR_TO_DATE(CONCAT('2021', '/', '09', '/01'), '%Y/%m/%d') BETWEEN 
recurring_start_date AND recurring_end_date AND userID = 1
GROUP BY category;

-- Budget --> Green bar
-- Change userID = 1 to the session's user id
SELECT category, budget_amount_per_month FROM budgets
WHERE userID = 1;

-- Income / Expenses Table
-- Change userID = 1 to the session's user id
SELECT * FROM v_incomeexpenses WHERE userID = 1
ORDER BY createdDt DESC;

-- Income page
-- Income table
-- Change userID = 1 to the session's user id
SELECT userID, name, amount, category, recurring, created_at FROM incomes WHERE userID = 1
ORDER BY created_at DESC;

-- Expenses page
-- Expenses table
-- Change userID = 1 to the session's user id
SELECT userID, name, amount, category, recurring, created_at FROM expenses WHERE userID = 1
ORDER BY created_at DESC;

-- Budget page 
-- Budget category pie chart
-- Change userID = 1 to the session's user id
SELECT category, budget_amount_per_month FROM budgets WHERE userID = 1;

-- Dashboard page
-- Current balance
SELECT current_balance FROM ledger;

-- Events to validate recurring bool 
SET GLOBAL event_scheduler = ON;
SHOW EVENTS;
-- Income
DELIMITER |
CREATE EVENT checkIncomeRecurrenceValue
   ON SCHEDULE 
	EVERY 1 DAY
   COMMENT 'Check if exisitng records are still recurring records'
   DO BEGIN
	UPDATE incomes
	SET recurring = 0
	WHERE recurring = TRUE AND CURRENT_DATE NOT BETWEEN recurring_start_date AND recurring_end_date;
  END|
DELIMITER ;
--Expenses
DELIMITER |
CREATE EVENT checkExpensesRecurrenceValue
   ON SCHEDULE 
	EVERY 1 DAY
   COMMENT 'Check if exisitng records are still recurring records'
   DO BEGIN
	UPDATE expenses
	SET recurring = 0
	WHERE recurring = TRUE AND CURRENT_DATE NOT BETWEEN recurring_start_date AND recurring_end_date;
  END|
DELIMITER ;

-- Events to insert records monthly
-- Expenses
DELIMITER |
CREATE EVENT insertRecurringExpenses
   ON SCHEDULE 
	EVERY 1 MONTH
   COMMENT 'Check for recurring expenses to be inserted into following months'
   DO BEGIN
	CALL crud_express.sp_insertRecurringExpenses();
  END|
DELIMITER ;
-- Income
DELIMITER |
CREATE EVENT insertRecurringIncomes
   ON SCHEDULE 
	EVERY 1 MONTH
   COMMENT 'Check for recurring incomes to be inserted into following months'
   DO BEGIN
	CALL crud_express.sp_insertRecurringIncomes();
  END|
DELIMITER ;

-- Events to check on goals done status
DELIMITER |
CREATE EVENT checkGoalsDoneValue
   ON SCHEDULE 
	EVERY 1 DAY
   COMMENT 'To mark as done if goals period is over'
   DO BEGIN
	UPDATE goals
	SET done = TRUE
	WHERE done = FALSE AND CURRENT_DATE NOT BETWEEN start_date AND end_date;
  END|
DELIMITER ;

-- Change userID = 1 to the session's user id
SELECT category, budget_amount_per_month FROM budgets
WHERE userID = 1;


-- Change userID = 1 to the session's user id
SELECT category, SUM(amount) AS 'total_exp' from expenses 
WHERE userID = 1 AND MONTH(created_at) = MONTH(CURRENT_TIMESTAMP) AND YEAR(created_at) = YEAR(CURRENT_TIMESTAMP)
GROUP BY category
ORDER BY category ASC;

