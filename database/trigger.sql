DROP TRIGGER IF EXISTS incomes_AFTER_INSERT;
DROP TRIGGER IF EXISTS incomes_AFTER_UPDATE;
DROP TRIGGER IF EXISTS expenses_AFTER_INSERT;
DROP TRIGGER IF EXISTS expenses_AFTER_UPDATE;
DROP TRIGGER IF EXISTS incomes_AFTER_DELETE;
DROP TRIGGER IF EXISTS expenses_AFTER_DELETE;
DROP TRIGGER IF EXISTS goals_BEFORE_INSERT; 
DROP TRIGGER IF EXISTS setupaccount;
DROP TRIGGER IF EXISTS complete_goal;
DROP TRIGGER IF EXISTS update_balance;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS ledger;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS budgethead;

CREATE TABLE users (
	userID INTEGER NOT NULL auto_increment PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
	password VARCHAR(25) NOT NULL
);

CREATE TABLE incomes (
    incomeID VARCHAR(256) NOT NULL PRIMARY KEY,
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(256) NOT NULL,
    amount DECIMAL(13,2) CHECK(amount >= 0),
    category VARCHAR(64),
    recurring_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    expensesID VARCHAR(256) NOT NULL PRIMARY KEY,
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(256) NOT NULL,
    amount DECIMAL(13,2) CHECK(amount >= 0),
    category VARCHAR(64),
	recurring_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger (
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    average_monthly_saving DECIMAL(13,2) DEFAULT 0,
    current_balance DECIMAL(13,2) DEFAULT 0
);

CREATE TABLE goals (
    goalID VARCHAR(256) NOT NULL PRIMARY KEY,
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(256) NOT NULL,
    amount DECIMAL(13,2) CHECK(amount >= 0),
    category VARCHAR(64),
    possible BOOLEAN DEFAULT 0,
    done BOOLEAN DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budgethead (
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    category VARCHAR(64),
    budget_amount_per_month DECIMAL(13,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users VALUES (1, 'admin', 'admin@hotmail.com', 'admin123');
INSERT INTO ledger VALUES (1, 0);

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
CREATE TRIGGER incomes_AFTER_DELETE AFTER DELETE ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance - old.amount
    WHERE userID=old.userID ;
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
    END|
DELIMITER 

DELIMITER |
CREATE TRIGGER goals_BEFORE_INSERT 
	BEFORE INSERT 
		ON goals FOR EACH ROW
	BEGIN
		CALL sp_calculateGoalPossibility(TIMESTAMPDIFF(MONTH, NEW.start_date, NEW.end_date), NEW.amount, NEW.userID, NEW.possible);
  END;|
DELIMITER ;
