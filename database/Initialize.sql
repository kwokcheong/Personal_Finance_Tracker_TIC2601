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