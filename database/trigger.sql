-- Incomes trigger
DELIMITER |
CREATE TRIGGER incomes_AFTER_INSERT  AFTER INSERT ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance+ new.amount
    WHERE userID=new.userID ;
  END;|
DELIMITER ;


DELIMITER |
CREATE TRIGGER incomes_AFTER_UPDATE AFTER UPDATE ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance - old.amount+ new.amount 
    WHERE userID=old.userID ;
    
  END;|
DELIMITER ;

DELIMITER |
CREATE TRIGGER incomes_AFTER_DELETE AFTER DELETE ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance - old.amount
    WHERE userID=old.userID ;
  END;|
DELIMITER ;

-- Expenses trigger
DELIMITER |
CREATE TRIGGER expenses_AFTER_UPDATE AFTER UPDATE ON expenses
  FOR EACH ROW
  BEGIN
	UPDATE ledger SET current_balance = current_balance + old.amount - new.amount 
    WHERE userID = old.userID ;
  END;|
DELIMITER ;


DELIMITER |
CREATE TRIGGER expenses_AFTER_INSERT AFTER INSERT ON expenses
  FOR EACH ROW
  BEGIN
	UPDATE ledger SET current_balance = current_balance- new.amount 
    WHERE userID = NEW.userID ;
  END;|
DELIMITER ;

DELIMITER |
CREATE TRIGGER expense_AFTER_DELETE AFTER DELETE ON expenses
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance + old.amount
    WHERE userID=old.userID ;
  END;|
DELIMITER ;

-- Others 
DELIMITER 
CREATE TRIGGER complete_goal
 AFTER UPDATE
    ON goals FOR EACH ROW
    BEGIN
    IF (getDate() = end_date)
    THEN SET done = 1
    END;| 
DELIMITER ;

DELIMITER 
CREATE TRIGGER update_balance
 AFTER INSERT
    ON incomes FOR EACH ROW
    BEGIN
    IF name = 'monthly salary'
	THEN INSERT INTO ledger(userID, average_monthly_saving, current_balance)
    i = income, e = expenses; 
    VALUES (2, AVG(NEW.current_balance), NEW.current_balance);
    NEW.current_balance = OLD.current_balance + i.amount + e.amount
    WHERE expenses
    DECLARE @today date = GetDate();
    SELECT Sum(amount) FROM expenses WHERE date >= DateAdd(month, -2, @today) AND date < DateAdd(month, -0, @today);
    END IF;
    END;|
DELIMITER ;

DELIMITER |
CREATE TRIGGER setupaccount
 AFTER INSERT
    ON users FOR EACH ROW
    BEGIN
    INSERT INTO ledger 
    SET
    userID = NEW.userID,
    current_balance = 0;
    INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Bills",
    budget_amount_per_month = 0;
    INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Food",
    budget_amount_per_month = 0;
    INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Luxury",
    budget_amount_per_month = 0;
    INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Others",
    budget_amount_per_month = 0;
    INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Transport",
    budget_amount_per_month = 0;
        INSERT INTO budgets
    SET
    userID = NEW.userID,
    category = "Utility",
    budget_amount_per_month = 0;
    END;|
DELIMITER; 

DELIMITER |
CREATE TRIGGER goals_BEFORE_INSERT 
	BEFORE INSERT 
		ON goals FOR EACH ROW
	BEGIN
		CALL sp_calculateGoalPossibility(TIMESTAMPDIFF(MONTH, NEW.start_date, NEW.end_date), NEW.amount, NEW.userID, NEW.possible);
  END;|
DELIMITER ;
