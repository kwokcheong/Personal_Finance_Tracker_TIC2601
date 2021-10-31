-- Bulk data seeding
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_insertBulkData` $$
CREATE PROCEDURE `sp_insertBulkData`()
BEGIN

DECLARE COUNTER INT DEFAULT 1;
DECLARE GOALS_COUNTER INT DEFAULT 1;

INSERT INTO ledger VALUES (1, 0);
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Food', FLOOR(RAND()*(1000-500+1)+500)), ('1', 'Luxury', FLOOR(RAND()*(1000-500+1)+500)),('1', 'Transport', FLOOR(RAND()*(1000-500+1)+500)), ('1', 'Bills', FLOOR(RAND()*(1000-500+1)+500)),('1', 'Others', FLOOR(RAND()*(1000-500+1)+500));

DROP TABLE IF EXISTS TempIncomeTableCategory; 
CREATE TEMPORARY TABLE TempIncomeTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempIncomeTableCategory VALUES ('1','Allowance'),('2','Freelance'),('3','Others');

DROP TABLE IF EXISTS TempExpensesTableCategory; 
CREATE TEMPORARY TABLE TempExpensesTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempExpensesTableCategory VALUES ('1','Bills'),('2','Food'),('3','Luxury'),('4','Others'),('5','Transport'),('6','Utility');

DROP TABLE IF EXISTS TempGoalsTableDesc; 
CREATE TEMPORARY TABLE TempGoalsTableDesc
(	
	`id` INT, 
    `goals_description` VARCHAR(256)
); 

INSERT INTO TempGoalsTableDesc VALUES ('1','Buy Secretlab Chair'),('2','Trip to Seoul'),('3','Buy rolex watch'),('4','Get Audi car'),('5','Grad trip');

-- Goals
WHILE GOALS_COUNTER <= 10 DO
	CALL sp_insertDataGoals(GOALS_COUNTER,(SELECT goals_description FROM TempGoalsTableDesc ORDER BY RAND() LIMIT 1));
    SET GOALS_COUNTER = GOALS_COUNTER + 1;
END WHILE;

-- Income and expenses
WHILE COUNTER <= 50 DO
	CALL sp_insertDataExpensesIncome(COUNTER,(SELECT category FROM TempIncomeTableCategory ORDER BY RAND() LIMIT 1),(SELECT category FROM TempExpensesTableCategory ORDER BY RAND() LIMIT 1));
    SET COUNTER = COUNTER + 1;
END WHILE;

WHILE COUNTER <= 60 DO
	INSERT INTO `crud_express`.`incomes` (`incomeID`,`userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`, `created_at`) VALUES 
	(COUNTER,'1', CONCAT('Income',COUNTER),'3000', 'Salary', CURRENT_DATE - INTERVAL FLOOR(RAND() * 300) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 100 DAY), '1', DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 250) DAY, INTERVAL 100 DAY));
    SET COUNTER = COUNTER + 1;
END WHILE;

END$$
DELIMITER;

-- Tables that require bulk data
-- Expenses and Income
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_insertDataExpensesIncome` $$
CREATE PROCEDURE `sp_insertDataExpensesIncome`(IN COUNTER INT, IN CATEGORY_INCOME TEXT, IN CATEGORY_EXPENSE TEXT)
BEGIN

	DECLARE INCOME_START_DATE DATE; 
    DECLARE INCOME_END_DATE DATE; 
    DECLARE INCOME_RECURRING BOOLEAN;
    
	DECLARE EXPENSES_START_DATE DATE; 
    DECLARE EXPENSES_END_DATE DATE; 
    DECLARE EXPENSES_RECURRING BOOLEAN;
    
    SET INCOME_START_DATE = CURRENT_DATE - INTERVAL FLOOR(RAND() * 300) DAY; 
    SET INCOME_RECURRING = FLOOR(RAND()*(1-0+1))+0; 
    IF INCOME_RECURRING THEN 
		 SET INCOME_END_DATE = DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 100 DAY);
	ELSE 
		 SET INCOME_END_DATE =  INCOME_START_DATE;
    END IF; 
    
	SET EXPENSES_START_DATE = CURRENT_DATE - INTERVAL FLOOR(RAND() * 300) DAY; 
    SET EXPENSES_RECURRING = FLOOR(RAND()*(1-0+1))+0; 
    IF EXPENSES_RECURRING THEN 
		 SET EXPENSES_END_DATE = DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 100 DAY);
	ELSE 
		 SET EXPENSES_END_DATE =  EXPENSES_START_DATE;
    END IF; 

	-- Income amount will be within range from 1500 - 2000 int
	INSERT INTO `crud_express`.`incomes` (`incomeID`,`userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`, `created_at`) VALUES 
	(COUNTER,'1', CONCAT('Income',COUNTER), FLOOR(RAND()*(2000-1500+1)+1500), CATEGORY_INCOME, INCOME_START_DATE, INCOME_END_DATE, INCOME_RECURRING, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 250) DAY, INTERVAL 100 DAY));
	
	-- Expenses amount will be within range from 500 - 1000 dec
	INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`,`recurring_start_date`, `recurring_end_date`, `recurring`, `created_at`) VALUES 
	(COUNTER,'1', CONCAT('Expense',COUNTER), RAND()*(1000-500)+500, CATEGORY_EXPENSE, EXPENSES_START_DATE, EXPENSES_END_DATE, EXPENSES_RECURRING, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 250) DAY, INTERVAL 100 DAY));
END$$
DELIMITER;

-- Goals
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_insertDataExpensesIncome` $$
CREATE PROCEDURE `sp_insertDataGoals`(GOALS_COUNTER INT, GOALS_DESCRIPTION TEXT)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    DECLARE DONE BOOLEAN;
    
    SET START_DATE = CURRENT_DATE - INTERVAL FLOOR(RAND() * 300) DAY; 
    SET END_DATE = DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 100 DAY); 
    IF END_DATE < DATE(NOW()) THEN 
		 SET DONE = 1;
	ELSE 
		 SET DONE = 0;
    END IF; 
    
	-- Goals amount will be within range from 500 - 1000 int
	INSERT INTO `crud_express`.`goals` (`goalID`,`userID`, `name`, `amount`, `description`, `possible`, `done`, `start_date`, `end_date`, `created_at`) VALUES 
	(GOALS_COUNTER,'1', CONCAT('Goal',GOALS_COUNTER),FLOOR(RAND()*(1000-500+1)+500), GOALS_DESCRIPTION, FLOOR(RAND()*(1-0+1))+0, DONE, START_DATE, END_DATE, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 250) DAY, INTERVAL 100 DAY));
END$$
DELIMITER;

-- Income / Expenses Form
-- Income Monthly bar chart / Line chart datapoint
-- For line chart, pass in true as parameter input
-- For bar graph, pass in false as parameter input
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_calculateIncomePerMonth` $$
CREATE PROCEDURE `sp_calculateIncomePerMonth`(IN IS_SUM_BY_CATEGORY BOOLEAN, IN USER_ID TEXT)
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
        `amount` DECIMAL(19,2)
	); 
    
    INSERT INTO TempIncomeTable
	SELECT 	
			I.incomeID,
			I.category, 
            MONTH(I.created_at), 
            YEAR(I.created_at), 
            I.amount
	FROM incomes I
    WHERE I.userID = USER_ID AND DATE(I.created_at) BETWEEN START_DATE AND END_DATE;
    
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calculateExpensesPerMonth`(IN IS_SUM_BY_CATEGORY BOOLEAN, IN USER_ID TEXT)
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
	WHERE E.userID = USER_ID AND DATE(E.created_at) BETWEEN START_DATE AND END_DATE;
	
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
		WHERE I.userID = USER_ID AND DATE(I.created_at) BETWEEN START_DATE AND END_DATE
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
		WHERE E.userID = USER_ID AND DATE(E.created_at) BETWEEN START_DATE AND END_DATE
		GROUP BY E.category
        ORDER BY E.category ASC);
    
    ELSE SELECT fn_calculateAverageExpense(USER_ID) AS avgExpenses;
    END IF; 
    
END$$
DELIMITER;