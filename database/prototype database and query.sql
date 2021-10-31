CREATE DATABASE IF NOT EXISTS crud_express;
USE crud_express;

SET GLOBAL event_scheduler = ON; 

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
    amount DECIMAL(13,2) CHECK(amount <= 0),
    category VARCHAR(64),
	recurring_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger (
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
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

DELIMITER |
CREATE TRIGGER goal_possible 
 AFTER INSERT 
    ON goals FOR EACH ROW
    BEGIN
    DECLARE avgmonth INT unsigned DEFAULT 6;
    DECLARE Avgsaving decimal(13,2);
    DECLARE expected_saving decimal(13,2);
    SET Avgsaving = SELECT SUM(amount) FROM incomes AND expenses 
    WHERE created_at FROM incomes AND expenses >= dateadd(month, 6, getdate());
    / avgmonth;
    SET expected_saving = Avgsaving * (SELECT MONTH(end_date) - SELECT MONTH(start_date));
    if(expected_saving >= NEW.amount) 
    THEN SET NEW.possible = 1; 
    END IF;
    END|
DELIMITER

DELIMITER |
CREATE TRIGGER setupaccount
 AFTER INSERT
    ON users FOR EACH ROW
    BEGIN
    INSERT INTO ledger 
    SET
    userID = NEW.userID,
    current_balance = 0;
    END|
DELIMITER 

DELIMITER |
CREATE TRIGGER update_balance
 AFTER INSERT
    ON incomes FOR EACH ROW
    BEGIN
    IF name = 'monthly salary'
	THEN INSERT INTO ledger(userID, current_balance)
    VALUES (2, NEW.current_balance);
    NEW.current_balance = OLD.current_balance + SUM(i.amount) + SUM(e.amount)
    WHERE expenses
    DECLARE @today date = GetDate();
    SELECT Sum(amount) FROM expenses WHERE date >= DateAdd(month, -2, @today) AND date < DateAdd(month, -0, @today);
    AND WHERE incomes
    DECLARE @today date = GetDate();
    SELECT Sum(amount) FROM incomes WHERE date >= DateAdd(month, -2, @today) AND date < DateAdd(month, -0, @today);
    END IF;
    END |
DELIMITER 


INSERT INTO users VALUES (2, 'Root', 'root@gmail.com', 'root123'); 

SELECT * FROM ledger; 

INSERT INTO incomes (incomeID, userID,amount, name, category, recurring_date,recurring) 
VALUES (0, 2, 3250.50, 'salary', 'monthly salary', '2021-10-10', 1); 

INSERT INTO expenses(expensesID, userID, name, amount, category, created_at)
VALUES(3, 2, 'Hokkien Mee', -5, 'food', '2021-10-18');

INSERT INTO expenses(expensesID, userID, name, amount, category, created_at)
VALUES(4, 2, 'Laksa', -2, 'food', '2021-10-18');

UPDATE expenses
SET amount = -5
WHERE userID = 2 AND created_at = '2021-10-18'; 

INSERT INTO expenses(expensesID, userID, name, amount, category, created_at)
VALUES(5, 2, 'Laksa', -5, 'food', '2021-10-18');

INSERT INTO expenses(expensesID, userID, name, amount, category, recurring_date, recurring)
VALUES(6, 2, 'bubbletea', -6.7, 'drink','2021-10-16', 1);

INSERT INTO expenses(expensesID, userID, name, amount, category, recurring_date, recurring)
VALUES(7, 2, 'bubbletea', -6.7, 'drink', '2021-10-17', 1);

INSERT INTO expenses(expensesID, userID, name, amount, category, recurring_date, recurring)
VALUES(8, 2, 'bubbletea', -6.7, 'drink', '2021-10-18', 1);

SELECT * FROM expenses;

SELECT * FROM expenses WHERE recurring = 1;

INSERT INTO incomes (incomeID, userID,amount, name, category, recurring_date,recurring) 
VALUES (1, 2, 3250.50, 'monthly salary', 'monthly salary', '2021-09-10', 1); 

SELECT * FROM incomes; 

SELECT * FROM ledger; 

INSERT INTO budgethead (userid, category, budget_amount_per_month) 
VALUES (2, 'food', -300);

 INSERT INTO budgethead (userid, category, budget_amount_per_month) 
VALUES (2, 'transport', -100);

SELECT * FROM budgethead; 

INSERT INTO goals (goalID, userID, name, amount, category, start_date, end_date) 
VALUES (1,2,'ps4',350, 'game', '2021-09-10', '2021-12-12');

INSERT INTO goals (goalID, userID, name, amount, category, start_date, end_date) 
VALUES (2,2,'Japantrip',800, 'holiday', '2021-09-10', '2021-10-25');

INSERT INTO goals (goalID, userID, name, amount, category, start_date, end_date) 
VALUES (3,2,'Kiseki',50, 'buffet', '2021-09-10', '2021-12-13');

SELECT * FROM goals;
