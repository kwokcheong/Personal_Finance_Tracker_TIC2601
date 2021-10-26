-- Bulk data seeding
DELIMETER $$
DROP PROCEDURE IF EXISTS `sp_insertBulkData` $$
CREATE PROCEDURE `sp_insertBulkData`()
BEGIN

DECLARE COUNTER INT DEFAULT 1;

INSERT INTO users (`name`, `email`, `password`) VALUES ('admin', 'admin@hotmail.com', 'admin');
INSERT INTO ledger VALUES (1, 0, 0);
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Food', RAND()*(1000-0)+10), ('1', 'Luxury', RAND()*(1000-0)+10),('1', 'Transport', RAND()*(1000-0)+10), ('1', 'Bills', RAND()*(1000-0)+10),('1', 'Others', RAND()*(1000-0)+10);

DROP TABLE IF EXISTS TempIncomeTableCategory; 
CREATE TEMPORARY TABLE TempIncomeTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempIncomeTableCategory VALUES ('1','Salary'),('2','Allowance'),('3','Freelance'),('4','Others');

DROP TABLE IF EXISTS TempExpensesTableCategory; 
CREATE TEMPORARY TABLE TempExpensesTableCategory
(	
	`id` INT, 
    `category` VARCHAR(10)
); 

INSERT INTO TempExpensesTableCategory VALUES ('1','Food'),('2','Luxury'),('3','Travel'),('4','Bills'),('5','Others'),('6','Utility');

WHILE COUNTER <= 300 DO
	CALL sp_insertData(COUNTER,(SELECT category FROM TempIncomeTableCategory ORDER BY RAND() LIMIT 1),(SELECT category FROM TempExpensesTableCategory ORDER BY RAND() LIMIT 1));
    SET COUNTER = COUNTER + 1;
END WHILE;

END$$
DELIMETER;

DELIMETER $$
DROP PROCEDURE IF EXISTS `sp_insertData` $$
CREATE PROCEDURE `sp_insertData`(COUNTER INT, CATEGORY_INCOME TEXT, CATEGORY_EXPENSE TEXT)
BEGIN

INSERT INTO `crud_express`.`incomes` (`incomeID`,`userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES 
	(COUNTER,'1', CONCAT('Income',COUNTER), RAND()*(1000-0)+10, CATEGORY_INCOME, CURRENT_DATE - INTERVAL FLOOR(RAND() * 2500) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0);

	INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`,`recurring_start_date`, `recurring_end_date`, `recurring`) VALUES 
	(COUNTER,'1', CONCAT('Expense',COUNTER), RAND()*(1000-0)+10, CATEGORY_EXPENSE, CURRENT_DATE - INTERVAL FLOOR(RAND() * 2500) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0);

END$$
DELIMETER;

-- Income table
-- Graphs months label --> should only query the past 6 months including current month
DELIMETER $$
DROP PROCEDURE IF EXISTS `sp_getAllMonthsFromDateDiff` $$
CREATE PROCEDURE `sp_getAllMonthsFromDateDiff`(INPUT_DATE DATE, MONTHS INT)
BEGIN
    
	SELECT 
	  DATE_FORMAT(m1, '%c') AS months
	FROM
	 (
	  SELECT 
	   DATE_SUB(CAST(NOW() AS DATE), INTERVAL MONTHS MONTH) +INTERVAL m MONTH as m1
	  FROM
	   (
		 SELECT
		   @rownum:=@rownum+1 as m
		 FROM
		  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) t1,
		  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) t2,
		  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) t3,
		  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) t4,
		  (SELECT @rownum:=-1) t0
	   ) d1
	 ) d2 
	WHERE
	  m1<= CAST(NOW() AS DATE)
	ORDER BY m1;
    
END$$
DELIMETER;

-- Monthly bar chart / Line chart datapoint
-- For line chart, pass in true as parameter input
-- For bar graph, pass in false as parameter input
DELIMETER $$
DROP PROCEDURE IF EXISTS `sp_calculateIncomePerMonth` $$
CREATE PROCEDURE `sp_calculateIncomePerMonth`(IS_SUM_BY_CATEGORY BOOLEAN)
BEGIN
	DROP TABLE IF EXISTS TempIncomeTableCategory; 
	CREATE TEMPORARY TABLE TempIncomeTableCategory
	(	
		`incomeID` VARCHAR(64),
		`category` VARCHAR(10), 
        `record_month` INT, 
        `record_year` INT,
        `amount` DECIMAL(19,2)
	); 
    
    INSERT INTO TempIncomeTableCategory
    SELECT 	
			I.incomeID,
			I.category, 
            MONTH(I.recurring_start_date), 
            YEAR(I.recurring_start_date), 
            I.amount
	FROM incomes I
    WHERE incomeID IN (SELECT I2.incomeID FROM incomes I2 WHERE I2.userID = 1 AND I2.recurring_start_date >= STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') AND  DATE(NOW()) <= I2.recurring_end_date);
    
    IF IS_SUM_BY_CATEGORY THEN 
		(SELECT TI.record_month, TI.record_year, TI.category, SUM(TI.amount) AS amount
		FROM TempIncomeTableCategory TI
		GROUP BY TI.record_month, TI.record_year,TI.category
		ORDER BY TI.record_month, TI.record_year ASC);
	ELSE
		(SELECT TI.record_month, TI.record_year, SUM(TI.amount) AS amount
		FROM TempIncomeTableCategory TI
		GROUP BY TI.record_month, TI.record_year
		ORDER BY TI.record_month, TI.record_year ASC);

    END IF; 

END$$
DELIMETER;