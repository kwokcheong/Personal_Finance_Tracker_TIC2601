DROP TRIGGER IF EXISTS incomes_AFTER_INSERT;
DROP TRIGGER IF EXISTS incomes_AFTER_UPDATE;
DROP TRIGGER IF EXISTS expenses_AFTER_INSERT;
DROP TRIGGER IF EXISTS expenses_AFTER_UPDATE;
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
INSERT INTO ledger VALUES (1, 500, 500);
INSERT INTO expenses VALUES (1, 1 ,'a', 500,'FOOD', '2021-04-03' , 1 ,CURRENT_TIMESTAMP);

delimiter |

CREATE TRIGGER incomes_AFTER_INSERT  AFTER INSERT ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance+ new.amount
    WHERE userID=new.userID ;
    
  END;
|

delimiter ;


delimiter |

CREATE TRIGGER incomes_AFTER_UPDATE AFTER UPDATE ON incomes
  FOR EACH ROW
  BEGIN
    UPDATE ledger SET current_balance = current_balance + new.amount 
    WHERE userID=old.userID ;
    
  END;
|

delimiter ;


delimiter |
CREATE TRIGGER expenses_AFTER_UPDATE AFTER UPDATE ON expenses
  FOR EACH ROW
  BEGIN
	UPDATE ledger SET current_balance = current_balance- new.amount 
    where userID = NEW.userID ;
    
  END;
|

delimiter ;


delimiter |
CREATE TRIGGER expenses_AFTER_INSERT AFTER INSERT ON expenses
  FOR EACH ROW
  BEGIN
	UPDATE ledger SET current_balance = current_balance- new.amount 
    where userID = NEW.userID ;
    
  END;
|

delimiter ;
