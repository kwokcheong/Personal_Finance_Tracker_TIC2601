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