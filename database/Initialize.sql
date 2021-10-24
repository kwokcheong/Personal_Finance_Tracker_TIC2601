CREATE DATABASE IF NOT EXISTS crud_express;
USE crud_express;

DROP TRIGGER IF EXISTS incomes_AFTER_INSERT;
DROP TRIGGER IF EXISTS incomes_AFTER_UPDATE;
DROP VIEW IF EXISTS userIncome;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS ledger;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS budgets;

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
    recurring_start_date DATE,
    recurring_end_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATE NOT NULL DEFAULT (DATE(CURRENT_TIMESTAMP))
);

CREATE TABLE expenses (
    expensesID VARCHAR(256) NOT NULL PRIMARY KEY,
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(256) NOT NULL,
    amount DECIMAL(13,2) CHECK(amount >= 0),
    category VARCHAR(64),
    recurring_start_date DATE,
    recurring_end_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT 0,
    created_at DATE NOT NULL DEFAULT (DATE(CURRENT_TIMESTAMP))
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
    created_at DATE NOT NULL DEFAULT (DATE(CURRENT_TIMESTAMP))
);

CREATE TABLE budgets (
	userID INTEGER REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    category VARCHAR(64),
    budget_amount_per_month DECIMAL(13,2) DEFAULT 0,
    created_at DATE NOT NULL DEFAULT (DATE(CURRENT_TIMESTAMP))
);

CREATE VIEW userIncome AS SELECT *FROM incomes WHERE userID = 1;

INSERT INTO users VALUES (1, 'admin', 'admin@hotmail.com', 'admin');
INSERT INTO ledger VALUES (1, 0, 0);

INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Food', '0');
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Luxury', '0');
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Transport', '0');
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Bills', '0');
INSERT INTO `crud_express`.`budgets` (`userID`, `category`, `budget_amount_per_month`) VALUES ('1', 'Others', '0');

INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('1', '1', 'income1', '1000', 'Salary', '2021-11-11', '2021-12-12', '1');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('2', '1', 'income2', '2000', 'Salary', '2021-11-11', '2021-12-12', '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('3', '1', 'income3', '1000', 'Salary', '2021-11-11', '2021-12-12', '1');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('4', '1', 'income4', '4000', 'Salary', '2021-11-11', '2021-12-12', '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('5', '1', 'income5', '3000', 'Salary', '2021-11-11', '2021-12-12', '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('6', '1', 'income6', '6000', 'Salary', '2021-11-11', '2021-12-12', '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('7', '1', 'income7', '5000', 'Salary', '2021-11-11', '2021-12-12', '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('11', '1', 'income1', '1000', 'Salary', '2021-11-11','2021-12-12',  '1');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('22', '1', 'income2', '2000', 'Salary', '2021-11-11','2021-12-12',  '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('33', '1', 'income3', '1000', 'Salary', '2021-11-11','2021-12-12',  '1');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('44', '1', 'income4', '4000', 'Salary', '2021-11-11','2021-12-12',  '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('55', '1', 'income5', '3000', 'Salary', '2021-11-11','2021-12-12',  '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('66', '1', 'income6', '6000', 'Salary', '2021-11-11','2021-12-12',  '0');
INSERT INTO `crud_express`.`incomes` (`incomeID`, `userID`, `name`, `amount`, `category`, `recurring_start_date`, `recurring_end_date`, `recurring`) VALUES ('77', '1', 'income7', '5000', 'Salary', '2021-11-11','2021-12-12',  '0');

INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('1', '1', 'Expense1', '100', 'Food', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('2', '1', 'Expense2', '200', 'Utility', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('3', '1', 'Expense3', '300', 'Bills', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('4', '1', 'Expense4', '800', 'Others', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('5', '1', 'Expense5', '400', 'Travel', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('6', '1', 'Expense6', '100', 'Food', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('7', '1', 'Expense7', '1500', 'Luxury', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('11', '1', 'Expense1', '100', 'Food', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('22', '1', 'Expense2', '200', 'Utility', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('33', '1', 'Expense3', '300', 'Bills', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('44', '1', 'Expense4', '800', 'Others', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('55', '1', 'Expense5', '400', 'Travel', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('66', '1', 'Expense6', '100', 'Food', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('77', '1', 'Expense7', '1500', 'Luxury', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('111', '1', 'Expense1', '100', 'Food', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('222', '1', 'Expense2', '200', 'Utility', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('333', '1', 'Expense3', '300', 'Bills', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('444', '1', 'Expense4', '800', 'Others', '2021-08-08', '0');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('555', '1', 'Expense5', '400', 'Travel', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('666', '1', 'Expense6', '100', 'Food', '2021-08-08', '1');
INSERT INTO `crud_express`.`expenses` (`expensesID`, `userID`, `name`, `amount`, `category`, `recurring_date`, `recurring`) VALUES ('777', '1', 'Expense7', '1500', 'Luxury', '2021-08-08', '0');