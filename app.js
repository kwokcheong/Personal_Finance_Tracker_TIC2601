//include dependencies
const createError = require('http-errors');
const { maxHeaderSize } = require('http');
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2');
const session = require('express-session')
require('dotenv').config()

//Set up routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//MySql Database Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'crud_express'
});

connection.connect(function(error) {
  error ? console.log(error) : console.log('Database connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

//listen to server
app.listen(3000, () => {
  console.log('server is running at port 3000');
});

module.exports = app;
