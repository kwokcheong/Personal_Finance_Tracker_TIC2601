var createError = require('http-errors');
const { maxHeaderSize } = require('http');
var express = require('express');
var path = require('path');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2');
require('dotenv').config()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//listen to server
app.listen(3000, () => {
  console.log('server is running at port 3000');
});

module.exports = app;
