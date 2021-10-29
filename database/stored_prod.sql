-- Bulk data seeding
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_insertBulkData` $$
CREATE PROCEDURE `sp_insertBulkData`()
BEGIN

DECLARE COUNTER INT DEFAULT 1;

INSERT INTO users (`name`, `email`, `password`) VALUES ('admin', 'admin@hotmail.com', 'admin');
INSERT INTO ledger VALUES (1, 0);
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Food', RAND()*(1000-0)+10), ('1', 'Luxury', RAND()*(1000-0)+10),('1', 'Transport', RAND()*(1000-0)+10), ('1', 'Bills', RAND()*(1000-0)+10),('1', 'Others', RAND()*(1000-0)+10);

DROP TABLE IF EXISTS TempIncomeTableCategory; 
CREATE TEMPORARY TABLE TempIncomeTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempIncomeTableCategory VALUES ('1','Allowance'),('2','Freelance'),('3','Others'),('4','Salary');

DROP TABLE IF EXISTS TempExpensesTableCategory; 
CREATE TEMPORARY TABLE TempExpensesTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempExpensesTableCategory VALUES ('1','Bills'),('2','Food'),('3','Luxury'),('4','Others'),('5','Transport'),('6','Utility');

WHILE COUNTER <= 6 DO
	CALL sp_insertData(COUNTER,(SELECT category FROM TempIncomeTableCategory ORDER BY RAND() LIMIT 1),(SELECT category FROM TempExpensesTableCategory ORDER BY RAND() LIMIT 1));
    SET COUNTER = COUNTER + 1;
END WHILE;

END$$
DELIMITER;

-- Tables that require bulk data
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_insertData` $$
CREATE PROCEDURE `sp_insertData`(COUNTER INT, CATEGORY_INCOME TEXT, CATEGORY_EXPENSE TEXT)
BEGIN

	INSERT INTO `crud_express`.`incomes` (`incomeID`,`userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`, `created_at`) VALUES 
	(COUNTER,'1', CONCAT('Income',COUNTER), RAND()*(1000-0)+10, CATEGORY_INCOME, CURRENT_DATE - INTERVAL FLOOR(RAND() * 2500) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0, CURRENT_DATE - INTERVAL FLOOR(RAND() * 1000) DAY);

	INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`,`recurring_start_date`, `recurring_end_date`, `recurring`, `created_at`) VALUES 
	(COUNTER,'1', CONCAT('Expense',COUNTER), RAND()*(1000-0)+10, CATEGORY_EXPENSE, CURRENT_DATE - INTERVAL FLOOR(RAND() * 2500) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0, CURRENT_DATE - INTERVAL FLOOR(RAND() * 1000) DAY);

END$$
DELIMITER;

-- Income / Expenses Form

-- Income Monthly bar chart / Line chart datapoint
-- For line chart, pass in true as parameter input
-- For bar graph, pass in false as parameter input
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_calculateIncomePerMonth` $$
CREATE PROCEDURE `sp_calculateIncomePerMonth`(IS_SUM_BY_CATEGORY BOOLEAN, USER_ID TEXT)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    
	SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());
    
	DROP TABLE IF EXISTS TempIncomeTable; 
	CREATE TEMPORARY TABLE TempIncomeTable
	(	
		`incomeID` VARCHAR(64),
		`category` VARCHAR(10), 
        `record_month` INT, 
        `record_year` INT,
        `amount` DECIMAL(13,2)
	); 
    
    INSERT INTO TempIncomeTable
	SELECT 	
			I.incomeID,
			I.category, 
            MONTH(I.created_at), 
            YEAR(I.created_at), 
            I.amount
	FROM incomes I
    WHERE incomeID IN (SELECT I2.incomeID FROM incomes I2 WHERE I2.userID = USER_ID AND I2.created_at BETWEEN START_DATE AND END_DATE);
    
    IF IS_SUM_BY_CATEGORY THEN 
		(SELECT TI.record_month, TI.record_year, TI.category, SUM(TI.amount) AS amount
		FROM TempIncomeTable TI
		GROUP BY TI.record_month, TI.record_year,TI.category
		ORDER BY TI.record_month, TI.record_year ASC);
	ELSE
		(SELECT TI.record_month, TI.record_year, SUM(TI.amount) AS amount
		FROM TempIncomeTable TI
		GROUP BY TI.record_month, TI.record_year
		ORDER BY TI.record_month, TI.record_year ASC);
	END IF; 

END$$
DELIMITER;


-- Expenses Monthly bar chart / Line chart datapoint
-- For line chart, pass in true as parameter input
-- For bar graph, pass in false as parameter input
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_calculateExpensesPerMonth` $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calculateExpensesPerMonth`(IS_SUM_BY_CATEGORY BOOLEAN, USER_ID TEXT)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    
	SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());

	DROP TABLE IF EXISTS TempExpensesTable; 
	CREATE TEMPORARY TABLE TempExpensesTable
	(	
		`expensesID` VARCHAR(64),
		`category` VARCHAR(10), 
        `record_month` INT, 
        `record_year` INT,
        `amount` DECIMAL(13,2)
	); 
    
    INSERT INTO TempExpensesTable
	SELECT 	
			E.expensesID,
			E.category, 
			MONTH(E.created_at), 
			YEAR(E.created_at), 
			E.amount
	FROM expenses E
	WHERE expensesID IN (SELECT E2.expensesID FROM expenses E2 WHERE E2.userID = USER_ID AND E2.created_at BETWEEN START_DATE AND END_DATE);
	
    IF IS_SUM_BY_CATEGORY THEN 
		(SELECT TE.record_month, TE.record_year, TE.category, SUM(TE.amount) AS amount
		FROM TempExpensesTable TE
		GROUP BY TE.record_month, TE.record_year,TE.category
		ORDER BY TE.record_month, TE.record_year ASC);
	ELSE
		(SELECT TE.record_month, TE.record_year, SUM(TE.amount) AS amount
		FROM TempExpensesTable TE
		GROUP BY TE.record_month, TE.record_year
		ORDER BY TE.record_month, TE.record_year ASC);
	END IF; 

END$$
DELIMITER;

-- Dashboard
-- Avg Income
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_calculateAverageIncome` $$
CREATE PROCEDURE `sp_calculateAverageIncome`(IN IS_SUM_BY_CATEGORY BOOLEAN, IN USER_ID TEXT)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    
    SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());
    
	IF IS_SUM_BY_CATEGORY THEN (
		SELECT I.category, (SUM(I.amount) / 6) FROM incomes I
		WHERE I.incomeID IN (SELECT I2.incomeID FROM incomes I2
						   WHERE I2.userID = USER_ID AND I2.created_at 
						   BETWEEN START_DATE AND END_DATE)
		GROUP BY I.category
		ORDER BY I.category ASC);
    
    ELSE SELECT fn_calculateAverageIncome(USER_ID) AS avgIncome;
    
    END IF; 
    
END$$
DELIMITER;

-- Avg Expenses
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_calculateAverageExpenses` $$
CREATE PROCEDURE `sp_calculateAverageExpenses`(IN IS_SUM_BY_CATEGORY BOOLEAN, IN USER_ID TEXT)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    
    SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());
    
	IF IS_SUM_BY_CATEGORY THEN (
		SELECT E.category, (SUM(E.amount) / 6) FROM expenses E
		WHERE E.expensesID IN (SELECT E2.expensesID FROM expenses E2
						   WHERE E2.userID = USER_ID AND E2.created_at 
						   BETWEEN START_DATE AND END_DATE)
		GROUP BY E.category
        ORDER BY E.category ASC);
    
    ELSE SELECT fn_calculateAverageExpense(USER_ID) AS avgExpenses;
    END IF; 
    
END$$
DELIMITER;