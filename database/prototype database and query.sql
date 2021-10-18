CREATE DATABASE IF NOT EXISTS crud_express;
USE crud_express;

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
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    amount DECIMAL(13,2) CHECK(amount >= 0), 
    category VARCHAR(64),
    recurring_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
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
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(256) NOT NULL,
    amount DECIMAL(13,2) CHECK(amount >= 0),
    category VARCHAR(64),
    possible BOOLEAN DEFAULT 0,
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

INSERT INTO incomes (userID,amount, category, recurring_date,recurring) 
VALUES (1, 3250.50, 'monthly salary', '2021-10-10', 1); 

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'Hokkien Mee', 5, 'food', '2021-10-18');

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'Laksa', 2, 'food', '2021-10-18');

UPDATE expenses
SET amount = 5
WHERE userID = 1 AND created_at = '2021-10-18'; 

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'Laksa', 5, 'food', '2021-10-18');

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'bubbletea', 6.7, 'drink', '2021-10-18');

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'bubbletea', 6.7, 'drink', '2021-10-17');

INSERT INTO expenses(userID, name, amount, category, created_at)
VALUES(1, 'bubbletea', 6.7, 'drink', '2021-10-16');

SELECT * FROM expenses;

SELECT * FROM expenses WHERE recurring = 1;