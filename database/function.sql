-- Insight page: Doughnut chart
-- Function: fn_isInputDateBetweenPeriod
DELIMETER $$
DROP FUNCTION IF EXISTS `fn_isInputDateBetweenPeriod`$$
CREATE FUNCTION `fn_isInputDateBetweenPeriod`(
	ip_year TEXT, 
    ip_month TEXT, 
    ip_start_period DATE, 
    ip_end_period DATE
) RETURNS tinyint(1)
BEGIN
	DECLARE INPUT_DATE DATE;
    DECLARE FINAL_OUTPUT BOOLEAN;
    
    SET INPUT_DATE = STR_TO_DATE(CONCAT(ip_Year, '/', ip_Month, '/01'), '%Y/%m/%d');
    
		IF ip_start_period IS NULL OR ip_end_period IS NULL
			THEN RETURN NULL;
		ELSE IF INPUT_DATE BETWEEN ip_start_period AND ip_end_period THEN
			 SET FINAL_OUTPUT = true; 
		ELSE 
			SET FINAL_OUTPUT = false;
		END IF; 
		RETURN (FINAL_OUTPUT);
        
    END IF; 
END$$
DELIMETER;

-- Function: fn_daysCounter
DELIMETER $$
DROP FUNCTION IF EXISTS `fn_daysCounter`$$
CREATE FUNCTION `fn_daysCounter`(
	ip_year TEXT, 
    ip_month TEXT
) RETURNS int
BEGIN
	DECLARE CURRENT_MONTH TEXT;
    DECLARE CURRENT_YEAR TEXT;
	DECLARE IS_DATE_WITIN_DATE_RANGE BOOLEAN;
    DECLARE FINAL_OUTPUT INT;
    
    SET CURRENT_MONTH = MONTH(NOW()); 
    SET CURRENT_YEAR = YEAR(NOW()); 
    SET IS_DATE_WITIN_DATE_RANGE = fn_isInputDateBetweenPeriod(ip_year, ip_month, STR_TO_DATE(CONCAT(CURRENT_YEAR, '/', CURRENT_MONTH, '/01'), '%Y/%m/%d'), STR_TO_DATE(CONCAT(CURRENT_YEAR, '/', CURRENT_MONTH, '/', DAY(LAST_DAY(NOW()))), '%Y/%m/%d'));
    
	IF IS_DATE_WITIN_DATE_RANGE = false
		THEN RETURN 0;
	ELSE 
		SET FINAL_OUTPUT = DAY(LAST_DAY(NOW())) - DAY(NOW());
	RETURN (FINAL_OUTPUT);
        
    END IF; 
END$$
DELIMETER;

-- Dashboard 
-- Static value for avg expenses
DELIMETER $$
DROP FUNCTION IF EXISTS `fn_calculateAverageExpense`$$
CREATE FUNCTION `fn_calculateAverageExpense`(ip_user TEXT) RETURNS decimal(13,2)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    DECLARE FINAL_OUTPUT DECIMAL(13,2);
    
    SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());
    
    SET FINAL_OUTPUT = (SELECT (SUM(E.amount) / 6) FROM expenses E 
						WHERE E.userID = ip_user AND E.created_at BETWEEN START_DATE AND END_DATE);
                        
RETURN FINAL_OUTPUT;
END$$
DELIMETER;

-- Static value for avg income
DELIMETER $$
DROP FUNCTION IF EXISTS `fn_calculateAverageIncome`$$
CREATE FUNCTION `fn_calculateAverageIncome`(ip_user TEXT) RETURNS decimal(13,2)
BEGIN

	DECLARE START_DATE DATE; 
    DECLARE END_DATE DATE; 
    DECLARE FINAL_OUTPUT DECIMAL(13,2);
    
    SET START_DATE = STR_TO_DATE(CONCAT(YEAR(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/', MONTH(DATE_SUB(DATE(NOW()),INTERVAL 5 MONTH)), '/01'), '%Y/%m/%d') ; 
    SET END_DATE = DATE(NOW());
    
    SET FINAL_OUTPUT = (SELECT (SUM(I.amount)/6) FROM incomes I 
						WHERE I.userID = ip_user AND I.created_at BETWEEN START_DATE AND END_DATE);
    
RETURN FINAL_OUTPUT;
END$$
DELIMETER;

-- Static value for av savings
DELIMETER $$
DROP FUNCTION IF EXISTS `fn_calculateAverageSavings`$$
CREATE FUNCTION `fn_calculateAverageSavings`(ip_user TEXT) RETURNS decimal(13,2)
BEGIN

	DECLARE INCOME DECIMAL(13,2); 
    DECLARE EXPENSES DECIMAL(13,2); 
    DECLARE FINAL_OUTPUT DECIMAL(13,2);
    
    SET INCOME = (SELECT fn_calculateAverageIncome(ip_user) AS avgIncome);
    SET EXPENSES = (SELECT fn_calculateAverageExpense(ip_user) AS avgExpenses);
    
    SET FINAL_OUTPUT = INCOME - EXPENSES;
	RETURN (FINAL_OUTPUT);
END$$
DELIMETER;