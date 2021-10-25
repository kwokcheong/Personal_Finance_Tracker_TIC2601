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
GROUP BY category
ORDER BY category ASC;

-- Budget --> Green bar
-- Change userID = 1 to the session's user id
SELECT category, budget_amount_per_month FROM budgets
WHERE userID = 1
ORDER BY category ASC;