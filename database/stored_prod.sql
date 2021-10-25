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
	(COUNTER,'1', CONCAT('Income',COUNTER), RAND()*(1000-0)+10, CATEGORY_INCOME, CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0);

	INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`,`recurring_start_date`, `recurring_end_date`, `recurring`) VALUES 
	(COUNTER,'1', CONCAT('Expense',COUNTER), RAND()*(1000-0)+10, CATEGORY_EXPENSE, CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, DATE_ADD(CURRENT_DATE - INTERVAL FLOOR(RAND() * 100) DAY, INTERVAL 365 DAY), FLOOR(RAND()*(1-0+1))+0);

END$$
DELIMETER;